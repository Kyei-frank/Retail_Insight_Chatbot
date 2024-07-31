import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';

function MarketInsights() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.csv');
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        const results = Papa.parse(csv, { header: true, dynamicTyping: true });
        setData(results.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

  const prepareBrandSalesData = (city) => {
    const cityData = data.filter(item => item.City === city);
    const brandSales = {};
    cityData.forEach(item => {
      if (brandSales[item.Brand]) {
        brandSales[item.Brand] += item['Sales_Volume(KG_LTRS)'];
      } else {
        brandSales[item.Brand] = item['Sales_Volume(KG_LTRS)'];
      }
    });
    return Object.entries(brandSales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const prepareSalesTrendsData = () => {
    const salesTrends = {};
    data.forEach(item => {
      if (!salesTrends[item.Period]) {
        salesTrends[item.Period] = {};
      }
      if (salesTrends[item.Period][item.Brand]) {
        salesTrends[item.Period][item.Brand] += item['Sales_Volume(KG_LTRS)'];
      } else {
        salesTrends[item.Period][item.Brand] = item['Sales_Volume(KG_LTRS)'];
      }
    });
    return Object.entries(salesTrends).map(([period, brands]) => ({
      period,
      ...brands,
    }));
  };

  const prepareMarketShareData = () => {
    const brandSales = {};
    data.forEach(item => {
      if (brandSales[item.Brand]) {
        brandSales[item.Brand] += item['Sales_Volume(KG_LTRS)'];
      } else {
        brandSales[item.Brand] = item['Sales_Volume(KG_LTRS)'];
      }
    });
    return Object.entries(brandSales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const prepareCitySalesData = () => {
    const citySales = {};
    data.forEach(item => {
      if (citySales[item.City]) {
        citySales[item.City] += item['Sales_Volume(KG_LTRS)'];
      } else {
        citySales[item.City] = item['Sales_Volume(KG_LTRS)'];
      }
    });
    return Object.entries(citySales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const prepareSalesVolumeDistributionData = () => {
    const distribution = {};
    data.forEach(item => {
      const volume = Math.floor(item['Sales_Volume(KG_LTRS)'] / 1000) * 1000;
      if (distribution[volume]) {
        distribution[volume]++;
      } else {
        distribution[volume] = 1;
      }
    });
    return Object.entries(distribution)
      .map(([name, value]) => ({ name: `${name}-${parseInt(name, 10) + 999}`, value }))
      .sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10));
  };

  const prepareInventoryLevelsData = () => {
    const inventoryLevels = {};
    data.forEach(item => {
      if (!inventoryLevels[item.Period]) {
        inventoryLevels[item.Period] = {};
      }
      if (inventoryLevels[item.Period][item['Item Name']]) {
        inventoryLevels[item.Period][item['Item Name']] += item['Sales_Volume(KG_LTRS)'];
      } else {
        inventoryLevels[item.Period][item['Item Name']] = item['Sales_Volume(KG_LTRS)'];
      }
    });
    return Object.entries(inventoryLevels).map(([period, items]) => ({
      period,
      ...items,
    }));
  };

  const prepareMeanUnitPriceByCity = () => {
    const cityPrices = {};
    data.forEach(item => {
      if (!cityPrices[item.City]) {
        cityPrices[item.City] = { sum: 0, count: 0 };
      }
      cityPrices[item.City].sum += item.Unit_Price;
      cityPrices[item.City].count += 1;
    });
    return Object.entries(cityPrices).map(([city, { sum, count }]) => ({
      name: city,
      value: sum / count,
    }));
  };

  const prepareTopBrandsInAbidjan = () => {
    const brandSales = {};
    data.filter(item => item.City === 'Abidjan').forEach(item => {
      if (!brandSales[item.Brand]) {
        brandSales[item.Brand] = 0;
      }
      brandSales[item.Brand] += item['Sales_Volume(KG_LTRS)'];
    });
    return Object.entries(brandSales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const prepareBrandComparisonAcrossCities = () => {
    const topBrands = prepareTopBrandsInAbidjan().map(brand => brand.name);
    const cityBrandSales = {};
    data.forEach(item => {
      if (topBrands.includes(item.Brand)) {
        if (!cityBrandSales[item.City]) {
          cityBrandSales[item.City] = {};
        }
        if (!cityBrandSales[item.City][item.Brand]) {
          cityBrandSales[item.City][item.Brand] = 0;
        }
        cityBrandSales[item.City][item.Brand] += item['Sales_Volume(KG_LTRS)'];
      }
    });
    return Object.entries(cityBrandSales).map(([city, brands]) => ({
      name: city,
      ...brands,
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const inventoryData = prepareInventoryLevelsData();
  const skuNames = Object.keys(inventoryData[0] || {}).filter(key => key !== 'period');

  return (
    <div className="market-insights p-4">
      <h2 className="text-2xl font-bold mb-2">Market Insights</h2>
      
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
        <p className="font-semibold">Note: For optimal viewing experience, you may expand the screen by closing the navigation bar to have a full view of the insights.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Total Sales Volume by Brand in Abidjan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareBrandSalesData('Abidjan')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Total Sales Volume by Brand in Bouake</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareBrandSalesData('Bouake')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Sales Trends Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prepareSalesTrendsData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(prepareSalesTrendsData()[0] || {}).filter(key => key !== 'period').map((brand, index) => (
                <Line type="monotone" dataKey={brand} stroke={COLORS[index % COLORS.length]} key={brand} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Market Share by Brand</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={prepareMarketShareData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {prepareMarketShareData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">City-Wise Sales Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareCitySalesData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Sales Volume Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareSalesVolumeDistributionData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow col-span-2">
          <h3 className="text-xl font-semibold mb-2">Inventory Levels Over Time for Each SKU</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={inventoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend wrapperStyle={{ position: 'right', top: 0 }} />
              {skuNames.map((sku, index) => (
                <Line type="monotone" dataKey={sku} stroke={COLORS[index % COLORS.length]} key={sku} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Mean Unit Price by City</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareMeanUnitPriceByCity()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="skyblue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Top-Performing Brands in Abidjan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareTopBrandsInAbidjan()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="lightcoral" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Brand Comparison Across Cities</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareBrandComparisonAcrossCities()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {prepareTopBrandsInAbidjan().map((brand, index) => (
                <Bar key={brand.name} dataKey={brand.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">You want to gain more Key Insights? Go to the navigation bar and get in touch with our NoodifyGPT</h3>
      </div>
    </div>
  );
}

export default MarketInsights;
