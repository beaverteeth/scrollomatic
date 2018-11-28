# scrollomatic

> Pretty scrollbar container for react

[![NPM](https://img.shields.io/npm/v/scrollomatic.svg)](https://www.npmjs.com/package/scrollomatic) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Install

```bash
npm install --save scrollomatic
```

## Live Example

[Live Scrollomatic Example](https://beaverteeth.github.io/scrollomatic/)

## Usage

Here we have a small div with a much larger div within it. The the larger div is wrapped
with a Scrollomatic which will assume the size of it's parent. 

You can pass styles to `Scrollomatic` with a `styles=` property.

```jsx
export default class App extends Component {

  render () {
    return (
      <div style={{
          margin: 30,
          width:250, 
          height: 250, 
          overflow: 'hidden',
          backgroundColor: 'lightgray',
          fontSize: 22,
          borderWidth: 1, 
          borderStyle: 'solid',
          borderColor: 'black'}}>
        <Scrollomatic>
          <div>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
          </div>
        </Scrollomatic>
      </div>
    )
  }
}
```

## License

MIT

Author [Seth Hamilton](https://github.com/SethHamilton)

Copyright 2018, Perple Corp and B4T Solutions

