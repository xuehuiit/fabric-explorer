# babel-plugin-transform-promise-to-bluebird

This plugin transforms `Promise` to `bluebird`.

## Example
```javascript
export default function main() {
	const taskA = getResultAsync(1337);
	const taskB = new Promise((resolve, reject) =>
		nodeCallbackFunc(42, (err, res) => err ? reject(err) : resolve(res))
	);
	return Promise.all([taskA, taskB]).then(([resA, resB]) => resA + resB);
}
```
Gets converted to:
```javascript
import {all, default as Promise} from 'bluebird';

export default function main() {
	const taskA = getResultAsync(1337);
	const taskB = new Promise((resolve, reject) =>
		nodeCallbackFunc(42, (err, res) => err ? reject(err) : resolve(res))
	);
	return all([taskA, taskB]).then(([resA, resB]) => resA + resB);
}
```

## Usage

1. Install *bluebird*: `npm install --save bluebird`
2. Install the *promise-to-bluebird* plugin: `npm install --save-dev babel-plugin-transform-promise-to-bluebird`
3. Add *transform-promise-to-bluebird* to your *.babelrc* file:
```json
{
	"plugins": ["transform-promise-to-bluebird"]
}
```
If you'r using the *transform-runtime* plugin add *transform-promise-to-bluebird* before
*transform-runtime*:
```json
{
	"plugins": [
		"transform-promise-to-bluebird",
		"transform-runtime"
	]
}
```
