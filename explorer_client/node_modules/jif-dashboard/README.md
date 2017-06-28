# JIF Dashboard
A dashboard framework to quickly build widget-based dashboards with.

Supports sections built out of widgets using a packery grid. Check out the `Samples` folder for a starting template.

## Demo
[See live demo here](https://jpmorganchase.github.io/jif-dashboard/demo/)

## Quickstart
Using npm and webpack

### npm
Add jif-dashboard and dependencies to the `package.json` file:

```JSON
"dependencies": {
	"jquery": "^3.0.0",
	"jquery-ui-dist": "^1.12.1",
	"jif-dashboard": "^1.0.0",
}
```

### Webpack
Import the files into CSS and JS files:

For example, in `index.js`
```javascript
// must have css loader
import 'jif-dashboard/dashboard.css'

import 'jif-dashboard/dashboard-core'
import 'jif-dashboard/dashboard-util'
import 'jif-dashboard/dashboard-template'
```

If you would like to use a loader such as babel, include jif-dashboard in `webpack.config.js`. Add appropriate dependencies in `package.json`.

	module:{
		loaders:[
			{
				...
				include: [
					path.resolve(__dirname, "node_modules/jif-dashboard")
				],
				loader: 'babel',
				...
			}
		]
	}

JIF has several front styling dependencies:

```HTML
<link rel="stylesheet" type="text/css" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
```

## How to Use

### General Flow

#### Initialize the grid
Set [Options](#options) and initialize the Dashboard grid with a call to `Dashboard.init()`. This creates the grid that makes up the core of the Dashboard.

#### Add a widget
Create a widget and pre-register any widgets you want with `Dashboard.preregisterWidgets()`. Further details on widget creation and registration are provided in the [Widgets](#widgets) section.

#### Create a section
Make a new section and add widgets to it. A more detailed overview is in [Sections](#sections).

### <a name="tith">Widgets</a>
Widgets hold the content of the dashboard. They have various sizes and have the option of being draggable and resizable. They also have various controls: links, refresh, close, and minimize.

#### `widget-root.js`
It is highly recommended that your widgets extend `widget-root.js`. As seen in the sample app, it is very helpful in helping widgets load smoothly. It provides a structure to your widgets, and any of its methods can be overridden. Place it in the same directory as your widgets.

#### Creating a Widget
Make a new directory called `widgets` to hold your widgets. The path should be `js/widgets/`. If you need to use a different path, override the Dashboard.registerWidget function.

Create a widget using `widget-template.js` in `/samples` for reference. The widget filename should be the same as `widgetId`. For example, a widget with an id of widget1 should be in a file named `widget1.js`. There is also another reference id `name`. If this value is not set in widgets, then it will be set to `widgetId`. This represents the internals of the widget - such as tables, charts, input fields, or anything else that represents your data.

The outer shell of widgets is created by `dashboard-template.js` and accessed through the `init()` function in each widget. Options are passed with `Dashboard.TEMPLATES.widget()`, such as name, title, and size. The `widget-shell-id`, a randomly generated id number for internal widget handling. The template can be overridden with a custom template by creating a new file and setting `Dashboard.TEMPLATES = require('custom-template.js');`.

You may explicitly register the widgets or leave it to be dynamically loaded by [section](#sections).

**To register the widget yourself**:

```javascript
// a file such as index.js

Dashboard.preregisterWidgets({
	'widget1' : require('./widgets/widget1'),
	'widget2' : require('./widgets/widget2'),
	'widget3' : require('./widgets/widget3'),
	// etc
});
```

#### Widget Options

**title**: (string) The title to be displayed for the widget.

**size**: (string) In order of increasing size - 'small', 'third', 'medium', or 'large'. The default is small.

**customButtons**: (string html) Use this to add custom html buttons to the header of the widget. The default is an empty string.

**hideLink**: (boolean) Whether or not a link icon will show up on the header of the widget. Clicking the link icon will copy a link to the widget to the clipboard.  The default is false.

**hideRefresh**: (boolean) Whether a refresh icon will show up on the widget header. Clicking the icon will cause the widget to refresh by fetching. The default is false.

**refreshOnStart**: (boolean) Whether the widget will refresh after it is loaded. This option is helpful if resize and storage are on and you have something in the widget body whose size depends on the widget, as it will ensure that everything is sized correctly.

**name**: (string) This is used internally and must be unique.

**widgetId**: (string) If you do not set a name, then you must have a widgetId. This can be set or passed through when registering widgets.

```javascript
// widget1.js

module.exports = function(id) {
	var extended = {
		widgetId: id, // id is passed from registering widget
		name: 'mywidget',
		title: 'My Widget',
		size: 'medium',
		hideLink: true,
		hidRefresh: false,
		customButtons: '<li><i class="add-account fa fa-plus-circle"></i></li>',
		// ...
	}
	var widget = _.extend({}, widgetRoot, extended);
	
	// register presence with screen manager
	Dashboard.addWidget(widget);
};
```

#### Loading flow
This is a walkthrough of how the widget is loaded. The earlier steps may vary depending on how you registered your widgets:

1. Add widget to a section for displaying
2. Widget is registered
3. `addWidget` in dashboard-core is called from the widget
4. Dashboard calls `widget.init`
	5. `widget.setData` is called by `widget.init`
	6. `widget.ready` is called by `widget.init`
	7. `widget.render` is called by `widget.init`
	8. `widget.fetch` is called by `widget.render`
	9. `widget.postRender` is called by `widget.render`
	10. `widget.subscribe` is called by `widget.init`

### <a name="tith">Sections</a>
Dashboards may have many sections. Sections are used to group widgets and as a reference to store widget sizes and sort orders.

Widgets are added to sections to be displayed. This will also register any widgets that you have not explicitly registered yourself:

```javascript
'sectionName': function() {
	var widgets = [
		{ widgetId: 'widget1' },
		{ widgetId: 'widget2' },
		{ widgetId: 'widget3' }
	];

	Dashboard.showSection('sectionName', widgets);
},
```

### <a name="tith">Options</a>
There are a few options you can use with the framework. Required settings are `appName` and `widgetContainer`.

The defaults are:

```javascript
settings: {
	appName: 'cakeshop',
	widgetContainer: '#grounds',
	resize: true,
	drag: true,
	storage: true,
	minWidth: 200,
	minHeight: 250
}
```

Set the options with `Dashboard.setOptions()` and pass in the settings you wish to change.

**appName**: (string) The name of your application

**widgetContainer**: (string) The id for the container that will hold your widgets.

**resize**: (boolean) Whether widgets are resizable

**drag**: (boolean) Whether widgets are draggable

**storage**: (boolean) Whether dragged locations and resizes are saved to be loaded on refresh/start. This is saved based on the dashboard `section`.

**minWidth**: (int) The minimum width of a widget. This is only relevant if resizing is on. 

**minHeight**: (int) The minimum height a widget can be resized to. 

##### The Widget Sizer
As an alternative to minWidth and minHeight, you may specify an element as the widget sizer by adding a class `.widget-sizer` to it. Jif-Dashboard will use the minimum width or height if it is specified in the options, then the widget sizer dimensions, and resort to the default only if nothing is present.

### External Functions
Jif Dashboard provides some external functions that may be helpful. 

#####`reset(singleSection)`
If resize, drag, and storage are enabled, reset will cause the widgets to be reset to their original layout. Passing in the boolean `singleSection` is optional. If **true**, it will only reset the current section, and if **false**, every section will be reset.

#####`removeWidget(shellId)`
This will remove the widget from the grid completely. Requires the widget's shell id, which can be accessed from the widget with `this.shell.id`. 

#####`clear()`
This clears the grid of displayed widgets, but does not remove them from the grid.

#####`hide(shellId)`
This will hide one widget, but will not remove it from the grid. Requires the widget's shell id, which can be accessed from the widget with `this.shell.id`. 

#####`show(opts)`
This will show the widget if it was hidden. `opts` is an object: `{widgetId: 123456}`, where `widgetId` is the widget's shell id, which can be accessed from the widget with `this.shell.id`.

### Utils
A few utils methods are provided in `dashboard-util.js`.

**emit**: Prints a maintenance message to the console, and triggers a `WidgetInternalEvent` the type of which can be passed into the emit call. This is helpful for triggering other events on the dashboard.
