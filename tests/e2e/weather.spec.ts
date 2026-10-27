import { expect, type Page, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
});

async function assertWeatherFlow(page: Page) {
  await page.route('https://geocoding-api.open-meteo.com/v1/search?**', async (route) => {
    const url = new URL(route.request().url());
    expect(url.searchParams.get('name')).toBe('São Paulo');

    await route.fulfill({
      json: {
        results: [
          {
            id: 3448439,
            name: 'São Paulo',
            admin1: 'São Paulo',
            country: 'Brasil',
            latitude: -23.55,
            longitude: -46.63,
            timezone: 'America/Sao_Paulo',
          },
        ],
      },
    });
  });
  let forecastRequests = 0;
  await page.route('https://api.open-meteo.com/v1/forecast?**', async (route) => {
    forecastRequests += 1;
    const url = new URL(route.request().url());
    expect(url.searchParams.get('latitude')).toBe('-23.55');
    expect(url.searchParams.get('longitude')).toBe('-46.63');
    expect(url.searchParams.get('forecast_days')).toBe('5');
    expect(url.searchParams.get('temperature_unit')).toBe('celsius');

    await route.fulfill({
      json: {
        current: {
          temperature_2m: 0,
          weather_code: 0,
          relative_humidity_2m: 64,
          wind_speed_10m: 12.5,
          precipitation: 0,
          surface_pressure: 1013.2,
        },
        daily: {
          time: ['2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31'],
          temperature_2m_max: [10, 11, 12, 13, 14],
          temperature_2m_min: [0, 1, 2, 3, 4],
          weather_code: [0, 1, 2, 3, 61],
          precipitation_probability_max: [0, 10, 20, 30, 80],
        },
      },
    });
  });
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Buscar cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'São Paulo, Brasil', exact: true })).toBeVisible();
  const currentWeather = page.getByRole('region', { name: 'São Paulo, Brasil', exact: true });
  await expect(currentWeather.getByText('0 °C', { exact: true })).toBeVisible();

  const forecast = page.getByRole('region', { name: 'Previsão de 5 dias', exact: true });
  await expect(forecast).toBeVisible();
  await expect(forecast.getByRole('listitem')).toHaveCount(5);

  await page.getByRole('button', { name: 'Fahrenheit', exact: true }).click();
  await expect(currentWeather.getByText('32 °F', { exact: true })).toBeVisible();
  await expect(forecast.getByText('Máx. 50 °F', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Fahrenheit' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(forecastRequests).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
}

test('busca uma cidade, exibe cinco dias e converte para Fahrenheit', async ({ page }) => {
  await assertWeatherFlow(page);
});

test('mostra nenhuma cidade encontrada quando o geocoding retorna objeto vazio', async ({
  page,
}) => {
  await page.route('https://geocoding-api.open-meteo.com/v1/search?**', (route) =>
    route.fulfill({ json: {} }),
  );
  const forecastRequests: string[] = [];
  await page.route('https://api.open-meteo.com/v1/forecast?**', (route) => {
    forecastRequests.push(route.request().url());
    return route.fulfill({ status: 500, json: { error: true } });
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Buscar cidade' }).fill('Cidade inexistente');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();

  await expect(
    page.getByRole('heading', {
      name: 'Nenhuma cidade encontrada para "Cidade inexistente"',
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Nenhuma cidade encontrada');
  await expect(page.getByRole('region', { name: 'Previsão de 5 dias' })).toHaveCount(0);
  await expect(page.getByRole('alert')).toHaveCount(0);
  expect(forecastRequests).toHaveLength(0);
});

test('renderiza o clima e permite conversão em viewport mobile de 375x812', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });

  await assertWeatherFlow(page);

  expect(await page.evaluate(() => ({ width: innerWidth, height: innerHeight }))).toEqual({
    width: 375,
    height: 812,
  });
});

for (const query of ['', '   ']) {
  test(`busca inválida ${JSON.stringify(query)} informa validação sem chamar API`, async ({
    page,
  }) => {
    const requests: string[] = [];
    await page.route('https://*.open-meteo.com/**', (route) => {
      requests.push(route.request().url());
      return route.fulfill({ json: {} });
    });
    await page.goto('/');
    const input = page.getByRole('searchbox', { name: 'Buscar cidade' });
    await input.fill(query);
    await page.getByRole('button', { name: 'Buscar', exact: true }).click();

    await expect(page.getByRole('alert')).toHaveText('Digite o nome de uma cidade.');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(requests).toEqual([]);
  });
}

test('preserva caracteres especiais na consulta e mostra ausência de resultados', async ({
  page,
}) => {
  const query = "São Tomé & Príncipe + d'Oeste?";
  const names: (string | null)[] = [];
  await page.route('https://geocoding-api.open-meteo.com/v1/search?**', (route) => {
    names.push(new URL(route.request().url()).searchParams.get('name'));
    return route.fulfill({ json: {} });
  });
  await page.goto('/');
  await page.getByRole('searchbox').fill(query);
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();

  await expect(
    page.getByRole('heading', { name: `Nenhuma cidade encontrada para "${query}"`, exact: true }),
  ).toBeVisible();
  expect(names).toEqual([query]);
});

for (const missing of ['current', 'daily']) {
  test(`forecast sem ${missing} mostra erro, limpa dados e permite retry`, async ({ page }) => {
    await assertWeatherFlow(page);
    await page.route('https://api.open-meteo.com/v1/forecast?**', (route) =>
      route.fulfill({
        json: missing === 'current' ? { daily: { time: [] } } : { current: { temperature_2m: 0 } },
      }),
    );
    await page.getByRole('button', { name: 'Buscar', exact: true }).click();

    await expect(page.getByRole('alert')).toContainText(
      'A resposta meteorológica está incompleta.',
    );
    await expect(page.getByRole('region', { name: 'São Paulo, Brasil', exact: true })).toHaveCount(
      0,
    );
    await expect(page.getByRole('region', { name: 'Previsão de 5 dias' })).toHaveCount(0);

    await page.route('https://api.open-meteo.com/v1/forecast?**', (route) =>
      route.fulfill({
        json: { current: { temperature_2m: 0 }, daily: { time: ['2026-10-27'] } },
      }),
    );
    await page.getByRole('button', { name: 'Tentar novamente' }).click();
    await expect(
      page
        .getByRole('region', { name: 'São Paulo, Brasil', exact: true })
        .getByText('32 °F', { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('alert')).toHaveCount(0);
  });
}
