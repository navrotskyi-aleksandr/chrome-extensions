async function fetchData() {
  const options = {
    method: 'GET',
  };

  const res = await fetch(
    'https://api.dmarket.com/exchange/v1/market/items?side=market&orderBy=personal&orderDir=desc&title=&priceFrom=0&priceTo=0&treeFilters=&gameId=a8db&types=dmarket&cursor=&limit=5&currency=USD&platform=browser&isLoggedIn=false',
    options,
  );
  const record = await res.json();

  document.getElementById('items').innerHTML = record.objects.map((item) => `<li>${item.title}</li>`).join('');
}
fetchData();
