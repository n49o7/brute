# brute

DOM filler for simple webapps where the data can contain Objects and/or Arrays.

Relies on HTML template elements.

Most useful when attached to an event.

## Usage

Define your templates using the standard HTML data- attributes to target a certain key or variable in the data.

- `data-bind` : the exact key or variable to use
- `data-iterate` : a key or variable that is or contains an Object `{}` or an Array `[]`
- `data-template` : the template to use when iterating

- `_` : a reference to the current key, variable or object

## Example

A YAML representation of the data that is passed:

```yaml
title: "Class of 2020"
people:
  alice
    age: 37
    hair: brunette
  bob
    age: 34
    hair: blonde
  charlie
    age: 59
    hair: grey
notes:
  - List item 1
  - List item 2
  - List item 3
```

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
  <div data-iterate="data.people" data-template="personTemplate">
  </div>
  <div data-iterate="data.notes" data-template="noteTemplate">
  </div>
  <template id="personTemplate">
    <div class="row">
      <div data-bind="_"></div>
      <div data-bind="age"></div>
      <div data-bind="hair"></div>
    </div>
  </template>
  <template id="noteTemplate">
    <div data-bind="_"></div>
  </template>
</body>

<style>
  .row { display: flex; flex-direction: row }
</style>
```