# brute

DOM filler for simple webapps, where the data can contain Objects and/or Arrays.

Relies on HTML template elements.

Can be used once or attached to an event.

Use it as a data binding and/or templating library :
- It's buildless since it's in the browser.
- No brackets involved!

## Usage

Define your binds using the standard HTML data- attributes.

- `data-bind` : a key or variable to use
- `data-iterate` : a key or variable that is or contains an Object `{}` or an Array `[]`
- `data-template` : the template to use when iterating
- `data-condition` : one or several tests to satisfy
- `_` : a reference to the current key, variable or object

You may replace these keywords by changing the values in the `keywords` variable. Ex: `Brute.keywords.condition = 'if'`.

You may use spaces and single quotes in your key names.

You may use dot notation (`data.title`) or brackets with double quotes (`data["title"]`) in the data- attributes. You do not need to escape apostrophes (`'`), but you can.

The following should all work :

- `data-bind="quite.some'path.you've got.there"`
- `data-bind="quite[some'path].you've got.there"`
- `data-bind="quite[\"some'path\"].you've got.there"`
- `data-bind="quite[\"some\'path\"].you've got.there"`

When iterating, you can specify conditions on the container or on its children (see `try.html`).

## Example

A YAML representation of the data that is passed :

```yaml
title: "Class of 2020"
people:
  alice:
    age: 37
    hair: brunette
  bob:
    age: 34
    hair: blonde
  charlie:
    age: 59
    hair: grey
notes:
  - List item 1
  - List item 2
  - List item 3
```

A page that will display the data :

```html
<script src="Brute.js"></script>
<script>
  var data = {}
  var source = new EventSource('/data')
  source.onmessage = function(e) {
    data = JSON.parse(e.data)
    Brute.fill()
  }
</script>

<body>
  
  <div data-bind="data.title"></div>

  <div data-iterate="data.people"
       data-template="personTemplate"
       data-condition="_.length > 3 && age > 37">
  </div>

  <div data-iterate="data.notes" data-template="noteTemplate"></div>
  
  <template id="personTemplate">
    <div class="row">
      <div data-bind="_"></div> - 
      <div data-bind="age"></div> - 
      <div data-bind="hair"></div>
    </div>
  </template>
  
  <template id="noteTemplate">
    <div data-bind="_"></div>
  </template>
  
</body>

<style>
  .row { display: flex }
</style>
```

A more advanced example, including comments, can be found in `try.html`.

## Limitations

- Security : uses a scoped `eval` function to evaluate conditions. Do not use this server-side!
