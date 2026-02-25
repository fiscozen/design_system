# @fiscozen/icons

Design system icon component (Font Awesome). For usage documentation and examples, see Storybook (Documentation/Media/FzIcon).

## FzIcon props

| Prop       | Type     | Default | Description |
|-----------|----------|---------|-------------|
| `name`    | `string` | required | Font Awesome icon name (e.g. `bell`, `check`). |
| `size`    | `IconSize` | `'lg'` | Size: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. |
| `variant` | `IconVariant` | `'far'` | Font Awesome style (e.g. `fas`, `far`, `fal`). |
| `spin`   | `boolean` | `false` | Enables spinning animation. |

To apply design system text color, use the <code>v-color</code> directive on the component (e.g. <code>&lt;FzIcon v-color:blue="500" /&gt;</code>). The root element is a <code>&lt;span role="presentation"&gt;</code>, so v-color is valid (SPAN is allowed in @fiscozen/style) and the icon can be nested inside <code>&lt;p&gt;</code> or <code>&lt;span&gt;</code> without invalid HTML.

## Notes

- For the current iteration we decided to ship icons in a bundle (svg + js style), no API or lazy loading is currently happening.
- To keep the bundle size low we use Font Awesome "icon kits" (Pro), so the shipped set is tailored. Configure `.npmrc` in the app root (see this repo); set `FONTAWESOME_PACKAGE_TOKEN` in the environment for the Pro token.