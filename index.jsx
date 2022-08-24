
import { render } from 'solid-js/web'
import { createResource } from 'solid-js'

const data = {
	Fruits: [
		'Tomato', 'Avocado', 'Blackberry', 'Blueberry', 'Blueberry', 'Raspberry', 'Cranberry', 'Strawberry',
		'Cherries', 'Coconut', 'Lemon', 'Lime', 'Olive'
	],
	Dairy: [
		'Milk', 'Egg', 'Parmesan', 'Mozarella', 'Sour Cream', 'Cottage Cheese', 'Ghee', 'Greek Yogurt',
		'Butter', 'Cream', 'Feta Cheese', 'Ricotta'
	],
	Vegetables: [
		'Arugula', 'Broccoli', 'Bok Choy', 'Bell Peppers', 'Cauliflower', 'Celery', 'Cabbage', 'Eggplant',
		'Artichokes', 'Garlic', 'Green Beans', 'Kimchi', 'Kale', 'Jalapeno', 'Peppers', 'Onions', 'Sauerkraut',
		'Radishes', 'Zucchini', 'Lettuce', 'Mushroom', 'Spinach', 'Brussel Sprouts', 'Sprout', 'Fennel',
		'Collard greens', 'Green Cabbage', 'Red Cabbage', 'Savoy Cabbage', 'Chinese Cabbage', 'Cucumber',
		'Okra', 'Asparagus', 'Chard', 'Jicama', 'Spaghetti Squash'
	],
	Nuts: [
		'Almond Nut', 'Brazil Nut', 'Hazelnut', 'Pecan', 'MacAdamia', 'Walnuts', 'Almond', 'Pine Kernel', 'Peanut', 'Pili Nut',
		'Pistachio', 'Cashew', 'Candlenut', // 'Ginkgo Nut', 'Chestnut', 'Acorn Nut' // bad	
		// not existent: Paradise nuts, Kola nuts, Karuka nuts, Cedar nuts, Bunya nuts, Baru nuts, Araucaria nuts, Sacha inchi nuts, Red bopple nuts

	],
	Seeds: [
		'Chia Seeds', 'Flaxseeds', 'Pumpkin Seed', 'Sesame Seeds', 'Hemp Seeds', 'Sunflower Seed'
	],
	Meat: [
		'Beef', 'Turkey', 'Bacon', 'Ham', 'Chicken', 'Lamb', 'Venison', 'Duck', 'Wild Boar', 'Bison', 'Goose', 'Rabbit', 
		'Pheasant', 'Pork',
	],
	Seafood: [
		
		'Roe', 'Caviar', 'Shad roe', 'Crab', 'Shrimps/Prawns', 'Cockle', 'Clam', 'Mussel', 'Oyster',
		'Scallop', 'Conch', 'Cuttlefish', 'Octopus', 'Squid', 'Surimi',
		// no carbs indicator
		'Salmon', 'Tuna', 'Shrimp', 'Lobster',

		'Trout',  'Whitefish', 'Basa',  'Black cod',  'Bluefish', 'Bombay duck', 'Bonito', 'Brill', 'Burbot',
		
		'Carp', 'Catfish', 'Cod',  'Eel', 'Flounder', 'Grouper', 'Haddock', 'Hake', 'Halibut', 'Herring', 'Lingcod', 'Mackerel', 'Mahi Mahi', 
		'Mullet', 'Orange roughy', 'Pacific saury', 'Parrotfish', 'Perch', 'Pollock',  'Pompano', 'Sablefish', 'Sardine', 'Shad', 'Shark', 'Skate',

		'Monkfish', 'Tilapia', 'Tilefish', 'Sturgeon', 'Snapper', 'Yellowtail', 'Anchovy', 'Swordfish',  'Smelt',
		'Whiting', 'Wahoo',  'Sole', 'Sablefish', 'Sea Bass',  'Turbot', 'Sea bream', 'Pike', 'Dorade', 'Pomfret',

		
		// Does not exist: 'Craw/Cray Fish',
	]
}

const categoryColor = {
	Fruits: '#fcf8cd',
	Dairy: '#cfdbe8',
	Vegetables: '#96b125',
	Nuts: '#8a6b50',
	Seeds: '#bfb555',
	Meat: '#f08081',
	Seafood: '#25b4ab'
}

let isRateLimited = false

const API = 'https://api.edamam.com/api/food-database/parser?'

const fields = params => Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&')

const callAPI = query => {
	const items = JSON.parse(localStorage.getItem('items') || '{}')
	if (!isRateLimited && !items[query]) {
		return fetch(API + fields({app_id: 'ca747d07', app_key: '722fabaee32b8118f7b1cb2e32b137cf', ingr: query}))
		.then(res => res.json()).then(data => {
			const items = JSON.parse(localStorage.getItem('items') || '{}')
			if (!data.parsed[0]) console.error(query, data)
			const {label, nutrients, image} = data.parsed[0].food || {}
			items[query] = {label, image, ...nutrients}
			localStorage.setItem('items', JSON.stringify(items))
			return items[query]
		})
		.catch(e => console.log('rate limited', e, isRateLimited = true))
	}
	return Promise.resolve(items[query])
}

const fixMissingImgs = name => {
	if (name === 'Yellowtail') return 'https://www.flkeysnews.com/news/local/v4o3x9/picture153558484/alternates/LANDSCAPE_1140/yellowtailsnapper1-noaa'
	if (name === 'Bombay Duck') return 'http://www.hosimlang.com/wp-content/uploads/2017/01/wp-image-1883684441jpg.jpg'
	name && console.error(name, 'has no image')
}

const Ingredient = ({ query, category }) => {
	const [data] = createResource(query, callAPI)
	// const {label, image, ENERC_KCAL, CHOCDF, PROCNT, FAT, FIBTG} = data()
	return (
		<li class="hexagon" style={'background:' + categoryColor[category]}>
			<div class="hexagontent">
				<figure class="image is-256x256"><img class="is-rounded" src={data()?.image || fixMissingImgs(data()?.label)} /></figure>
				<h1>{data()?.label || query}</h1>
				<div>
					<span style='border: 2px solid yellow'>Energy<br/>{data()?.ENERC_KCAL.toFixed(1)} kcal</span>
					<span style='border: 2px solid lightblue'>Fat<br/>{data()?.FAT.toFixed(1)}g</span>
					<span style='border: 2px solid green'>Protein<br/>{data()?.PROCNT.toFixed(1)}g</span>
					{data()?.CHOCDF ? <span style='border: 2px solid red;border-radius: 3px'>Carbs<br/>{data().CHOCDF.toFixed(1)}g</span> : ''}
					{data()?.FIBTG ? <span style='border: 2px solid yellowgreen'>Fibre<br/>{data().FIBTG.toFixed(1)}g</span> : ''}
				</div>
	  		</div>
		</li>
	)
}

const App = () => (
	<div class="honeycomb">
		{Object.entries(data).map(([category, ingredients]) => (
			ingredients.map(ingredient => <Ingredient query={ingredient} category={category} />)
		))}
	</div>
)

render(App, document.body)
