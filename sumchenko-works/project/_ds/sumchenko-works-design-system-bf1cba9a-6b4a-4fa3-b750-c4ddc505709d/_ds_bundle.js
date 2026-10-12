/* @ds-bundle: {"format":4,"namespace":"SumchenkoWorksDesignSystem_bf1cba","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"ICON_NAMES","sourcePath":"components/brand/Icon.jsx"},{"name":"Icon","sourcePath":"components/brand/Icon.jsx"},{"name":"PixelLogo","sourcePath":"components/brand/PixelLogo.jsx"},{"name":"SectionHead","sourcePath":"components/brand/SectionHead.jsx"},{"name":"Coord","sourcePath":"components/brand/SectionHead.jsx"},{"name":"ThemeToggle","sourcePath":"components/brand/ThemeToggle.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Tag","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"SpecList","sourcePath":"components/display/SpecList.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Radio","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Input.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"IsoDiagram","sourcePath":"components/graphics/IsoDiagram.jsx"},{"name":"PixelField","sourcePath":"components/graphics/PixelField.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"86a93b6494f3","components/actions/IconButton.jsx":"577ab60c8c19","components/brand/Icon.jsx":"98686756af41","components/brand/PixelLogo.jsx":"8610c001e4ac","components/brand/SectionHead.jsx":"3595fb895823","components/brand/ThemeToggle.jsx":"a0b0af9e8133","components/display/Badge.jsx":"3a38d38dd139","components/display/Card.jsx":"8037063aaf56","components/display/SpecList.jsx":"fae68923e91a","components/feedback/Dialog.jsx":"028e4eea7d5a","components/feedback/Toast.jsx":"57c74d492060","components/feedback/Tooltip.jsx":"fe891dba37c5","components/forms/Checkbox.jsx":"5810c82c2801","components/forms/Input.jsx":"9aefd230e85c","components/forms/Select.jsx":"0cd69aa0fe1c","components/forms/Switch.jsx":"de2f4ba5d3fd","components/graphics/IsoDiagram.jsx":"c6d18b821257","components/graphics/PixelField.jsx":"ec177b0a8335","components/navigation/NavBar.jsx":"9f30a405a2e3","components/navigation/Tabs.jsx":"a7407ecffead","ui_kits/portfolio/CaseStudy.jsx":"75cf1ac4aff9","ui_kits/portfolio/Contact.jsx":"60ab3dcd16a8","ui_kits/portfolio/Home.jsx":"94f8954ca505","ui_kits/portfolio/Shell.jsx":"19119b5296d8","ui_kits/portfolio/Work.jsx":"73d2c548eb46","ui_kits/portfolio/data.js":"765173f404e7"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SumchenkoWorksDesignSystem_bf1cba = window.SumchenkoWorksDesignSystem_bf1cba || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Icon.jsx
try { (() => {
// Pixelarticons v1.8.1 (MIT, github.com/halfmage/pixelarticons) — path data copied verbatim from assets/icons/*.svg. 24×24 grid, fill=currentColor.
const PATHS = {
  "alert": ["M13 1h-2v2H9v2H7v2H5v2H3v2H1v2h2v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h2v-2h-2V9h-2V7h-2V5h-2V3h-2V1zm0 2v2h2v2h2v2h2v2h2v2h-2v2h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-2H3v-2h2V9h2V7h2V5h2V3h2zm0 4h-2v6h2V7zm0 8h-2v2h2v-2z"],
  "arrow-down": ["M11 4h2v12h2v2h-2v2h-2v-2H9v-2h2V4zM7 14v2h2v-2H7zm0 0v-2H5v2h2zm10 0v2h-2v-2h2zm0 0v-2h2v2h-2z"],
  "arrow-left": ["M20 11v2H8v2H6v-2H4v-2h2V9h2v2h12zM10 7H8v2h2V7zm0 0h2V5h-2v2zm0 10H8v-2h2v2zm0 0h2v2h-2v-2z"],
  "arrow-right": ["M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2H4zm10-4h2v2h-2V7zm0 0h-2V5h2v2zm0 10h2v-2h-2v2zm0 0h-2v2h2v-2z"],
  "arrow-up": ["M11 20h2V8h2V6h-2V4h-2v2H9v2h2v12zM7 10V8h2v2H7zm0 0v2H5v-2h2zm10 0V8h-2v2h2zm0 0v2h2v-2h-2z"],
  "article": ["M5 3H3v18h18V3H5zm14 2v14H5V5h14zm-2 2H7v2h10V7zM7 11h10v2H7v-2zm7 4H7v2h7v-2z"],
  "bookmark": ["M18 2H6v2h12v16h-2v-2h-2v-2h-4v2H8v2H6V2H4v20h4v-2h2v-2h4v2h2v2h4V2h-2z"],
  "briefcase": ["M8 3h8v4h6v14H2V7h6V3zm2 4h4V5h-4v2zM4 9v10h16V9H4z"],
  "calendar": ["M15 2h2v2h4v18H3V4h4V2h2v2h6V2zM5 8h14V6H5v2zm0 2v10h14V10H5z"],
  "chart-bar": ["M13 5h2v14h-2V5zm-2 4H9v10h2V9zm-4 4H5v6h2v-6zm12 0h-2v6h2v-6z"],
  "check": ["M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"],
  "chevron-down": ["M7 8H5v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2h-2v-2H9v-2H7V8z"],
  "chevron-left": ["M16 5v2h-2V5h2zm-4 4V7h2v2h-2zm-2 2V9h2v2h-2zm0 2H8v-2h2v2zm2 2v-2h-2v2h2zm0 0h2v2h-2v-2zm4 4v-2h-2v2h2z"],
  "chevron-right": ["M8 5v2h2V5H8zm4 4V7h-2v2h2zm2 2V9h-2v2h2zm0 2h2v-2h-2v2zm-2 2v-2h2v2h-2zm0 0h-2v2h2v-2zm-4 4v-2h2v2H8z"],
  "chevron-up": ["M7 16H5v-2h2v-2h2v-2h2V8h2v2h2v2h2v2h2v2h-2v-2h-2v-2h-2v-2h-2v2H9v2H7v2z"],
  "circle": ["M17 3H7v2H5v2H3v10h2v2h2v2h10v-2h2v-2h2V7h-2V5h-2V3zm0 2v2h2v10h-2v2H7v-2H5V7h2V5h10z"],
  "clock": ["M19 3H5v2H3v14h2v2h14v-2h2V5h-2V3zm0 2v14H5V5h14zm-8 2h2v6h4v2h-6V7z"],
  "close": ["M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"],
  "cloud": ["M16 4h-6v2H8v2H4v2H2v2H0v6h2v2h20v-2h2v-6h-2v-2h-2V8h-2V6h-2V4zm2 8h4v6H2v-6h2v-2h4v2h2v-2H8V8h2V6h6v2h2v4zm0 0v2h-2v-2h2z"],
  "code": ["M8 5h2v2H8V5zM6 7h2v2H6V7zM4 9h2v2H4V9zm-2 2h2v2H2v-2zm2 2h2v2H4v-2zm2 2h2v2H6v-2zm2 2h2v2H8v-2zm8-12h-2v2h2V5zm2 2h-2v2h2V7zm2 2h-2v2h2V9zm2 2h-2v2h2v-2zm-2 2h-2v2h2v-2zm-2 2h-2v2h2v-2zm-2 2h-2v2h2v-2z"],
  "copy": ["M4 2h11v2H6v13H4V2zm4 4h12v16H8V6zm2 2v12h8V8h-8z"],
  "dashboard": ["M3 3h8v10H3V3zm2 2v6h4V5H5zm8-2h8v6h-8V3zm2 2v2h4V5h-4zm-2 6h8v10h-8V11zm2 2v6h4v-6h-4zM3 15h8v6H3v-6zm2 2v2h4v-2H5z"],
  "download": ["M13 17V3h-2v10H9v-2H7v2h2v2h2v2h2zm8 2v-4h-2v4H5v-4H3v6h18v-2zm-8-6v2h2v-2h2v-2h-2v2h-2z"],
  "external-link": ["M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z"],
  "eye": ["M8 6h8v2H8V6zm-4 4V8h4v2H4zm-2 2v-2h2v2H2zm0 2v-2H0v2h2zm2 2H2v-2h2v2zm4 2H4v-2h4v2zm8 0v2H8v-2h8zm4-2v2h-4v-2h4zm2-2v2h-2v-2h2zm0-2h2v2h-2v-2zm-2-2h2v2h-2v-2zm0 0V8h-4v2h4zm-10 1h4v4h-4v-4z"],
  "file": ["M3 22h18V8h-2V6h-2v2h-2V6h2V4h-2V2H3v20zm2-2V4h8v6h6v10H5z"],
  "folder": ["M4 4h8v2h10v14H2V4h2zm16 4H10V6H4v12h16V8z"],
  "git-branch": ["M5 2h2v12h3v3h7v-7h-3V2h8v8h-3v9h-9v3H2v-8h3V2zm15 6V4h-4v4h4zM8 19v-3H4v4h4v-1z"],
  "git-commit": ["M7 7h10v4h5v2h-5v4H7v-4H2v-2h5V7zm2 2v6h6V9H9z"],
  "github": ["M5 2h4v2H7v2H5V2Zm0 10H3V6h2v6Zm2 2H5v-2h2v2Zm2 2v-2H7v2H3v-2H1v2h2v2h4v4h2v-4h2v-2H9Zm0 0v2H7v-2h2Zm6-12v2H9V4h6Zm4 2h-2V4h-2V2h4v4Zm0 6V6h2v6h-2Zm-2 2v-2h2v2h-2Zm-2 2v-2h2v2h-2Zm0 2h-2v-2h2v2Zm0 0h2v4h-2v-4Z"],
  "grid": ["M2 2h20v20H2V2zm2 2v4h4V4H4zm6 0v4h4V4h-4zm6 0v4h4V4h-4zm4 6h-4v4h4v-4zm0 6h-4v4h4v-4zm-6 4v-4h-4v4h4zm-6 0v-4H4v4h4zm-4-6h4v-4H4v4zm6-4v4h4v-4h-4z"],
  "home": ["M14 2h-4v2H8v2H6v2H4v2H2v2h2v10h7v-6h2v6h7V12h2v-2h-2V8h-2V6h-2V4h-2V2zm0 2v2h2v2h2v2h2v2h-2v8h-3v-6H9v6H6v-8H4v-2h2V8h2V6h2V4h4z"],
  "human": ["M10 2h4v4h-4V2zM3 7h18v2h-6v13h-2v-6h-2v6H9V9H3V7z"],
  "info-box": ["M3 3h2v18H3V3zm16 0H5v2h14v14H5v2h16V3h-2zm-8 6h2V7h-2v2zm2 8h-2v-6h2v6z"],
  "label": ["M12 2H2v10h2v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h-2v-2h-2V8h-2V6h-2V4h-2V2zm0 2v2h2v2h2v2h2v2h2v2h-2v2h-2v2h-2v2h-2v-2h-2v-2H8v-2H6v-2H4V4h8zM6 6h2v2H6V6z"],
  "layout": ["M2 5h20v14H2V5zm2 2v4h16V7H4zm16 6H10v4h10v-4zM8 17v-4H4v4h4z"],
  "link": ["M4 6h7v2H4v8h7v2H2V6h2zm16 0h-7v2h7v8h-7v2h9V6h-2zm-3 5H7v2h10v-2z"],
  "list": ["M6 6H4v2h2V6zm14 0H8v2h12V6zM4 11h2v2H4v-2zm16 0H8v2h12v-2zM4 16h2v2H4v-2zm16 0H8v2h12v-2z"],
  "mail": ["M22 4H2v16h20V4zM4 18V6h16v12H4zM8 8H6v2h2v2h2v2h4v-2h2v-2h2V8h-2v2h-2v2h-4v-2H8V8z"],
  "map": ["M8 2h2v2h2v2h-2v10H8V6H6V4h2V2zM4 8V6h2v2H4zm2 10v2H4v2H2V8h2v10h2zm0 0h2v-2H6v2zm6 0h-2v-2h2v2zm2-10V6h-2v2h2zm2 0h-2v10h-2v2h2v2h2v-2h2v-2h2v-2h2V2h-2v2h-2v2h-2v2zm0 0h2V6h2v10h-2v2h-2V8z"],
  "menu": ["M4 6h16v2H4V6zm0 5h16v2H4v-2zm16 5H4v2h16v-2z"],
  "message": ["M20 2H2v20h2V4h16v12H6v2H4v2h2v-2h16V2h-2z"],
  "minus": ["M4 11h16v2H4z"],
  "moon": ["M6 2h8v2h-2v2h-2V4H6V2ZM4 6V4h2v2H4Zm0 10H2V6h2v10Zm2 2H4v-2h2v2Zm2 2H6v-2h2v2Zm10 0v2H8v-2h10Zm2-2v2h-2v-2h2Zm-2-4h2v4h2v-8h-2v2h-2v2Zm-6 0v2h6v-2h-6Zm-2-2h2v2h-2v-2Zm0 0V6H8v6h2Z"],
  "pause": ["M10 4H5v16h5V4zm9 0h-5v16h5V4z"],
  "play": ["M10 20H8V4h2v2h2v3h2v2h2v2h-2v2h-2v3h-2v2z"],
  "plus": ["M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4z"],
  "reload": ["M16 2h-2v2h2v2H4v2H2v5h2V8h12v2h-2v2h2v-2h2V8h2V6h-2V4h-2V2zM6 20h2v2h2v-2H8v-2h12v-2h2v-5h-2v5H8v-2h2v-2H8v2H6v2H4v2h2v2z"],
  "search": ["M6 2h8v2H6V2zM4 6V4h2v2H4zm0 8H2V6h2v8zm2 2H4v-2h2v2zm8 0v2H6v-2h8zm2-2h-2v2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm0-8h2v8h-2V6zm0 0V4h-2v2h2z"],
  "server": ["M3 3h18v18H3V3zm2 2v6h14V5H5zm14 8H5v6h14v-6zM7 7h2v2H7V7zm2 8H7v2h2v-2z"],
  "sliders": ["M17 4h2v10h-2V4zm0 12h-2v2h2v2h2v-2h2v-2h-4zm-4-6h-2v10h2V10zm-8 2H3v2h2v6h2v-6h2v-2H5zm8-8h-2v2H9v2h6V6h-2V4zM5 4h2v6H5V4z"],
  "sun": ["M13 3h-2v2h2V3zm4 2h2v2h-2V5zm-6 6h2v2h-2v-2zm-8 0h2v2H3v-2zm18 0h-2v2h2v-2zM5 5h2v2H5V5zm14 14h-2v-2h2v2zm-8 2h2v-2h-2v2zm-4-2H5v-2h2v2zM9 7h6v2H9V7zm0 8H7V9h2v6zm0 0v2h6v-2h2V9h-2v6H9z"],
  "upload": ["M11 5V3h2v2h2v2h2v2h-2V7h-2v10h-2V7H9v2H7V7h2V5h2zM3 15v6h18v-6h-2v4H5v-4H3z"],
  "user": ["M15 2H9v2H7v6h2V4h6V2zm0 8H9v2h6v-2zm0-6h2v6h-2V4zM4 16h2v-2h12v2H6v4h12v-4h2v6H4v-6z"],
  "zap": ["M12 1h2v8h8v4h-2v-2h-8V5h-2V3h2V1zM8 7V5h2v2H8zM6 9V7h2v2H6zm-2 2V9h2v2H4zm10 8v2h-2v2h-2v-8H2v-4h2v2h8v6h2zm2-2v2h-2v-2h2zm2-2v2h-2v-2h2zm0 0h2v-2h-2v2z"]
};
const ICON_NAMES = Object.keys(PATHS);
function Icon({
  name,
  size = 16,
  title,
  style,
  ...rest
}) {
  const ds = PATHS[name];
  if (!ds) return null;
  return React.createElement('svg', Object.assign({
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': title ? undefined : true,
    role: title ? 'img' : undefined,
    shapeRendering: 'crispEdges',
    style: Object.assign({
      display: 'inline-block',
      flex: 'none',
      verticalAlign: 'middle'
    }, style)
  }, rest), title ? React.createElement('title', null, title) : null, ds.map((d, i) => React.createElement('path', {
    key: i,
    d: d
  })));
}
Object.assign(__ds_scope, { ICON_NAMES, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Icon.jsx", error: String((e && e.message) || e) }); }

// components/actions/Button.jsx
try { (() => {
function Button({
  variant = 'primary',
  size = 'md',
  iconStart,
  iconEnd,
  block = false,
  href,
  as,
  className = '',
  children,
  ...rest
}) {
  const Tag = as || (href ? 'a' : 'button');
  const iconSize = size === 'sm' ? 14 : 16;
  const props = {
    className: ('sw-btn ' + className).trim(),
    'data-variant': variant,
    'data-size': size,
    'data-block': block ? 'true' : undefined,
    ...rest
  };
  if (href) props.href = href;
  if (Tag === 'button' && !rest.type) props.type = 'button';
  return /*#__PURE__*/React.createElement(Tag, props, iconStart ? /*#__PURE__*/React.createElement("span", {
    className: "sw-btn__icon",
    "data-slot": "start"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconStart,
    size: iconSize
  })) : null, children != null ? /*#__PURE__*/React.createElement("span", null, children) : null, iconEnd ? /*#__PURE__*/React.createElement("span", {
    className: "sw-btn__icon",
    "data-slot": "end"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconEnd,
    size: iconSize
  })) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  icon,
  label,
  variant = 'outline',
  size = 'md',
  pressed,
  className = '',
  ...rest
}) {
  const iconSize = size === 'lg' ? 24 : 16;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: ('sw-iconbtn ' + className).trim(),
    "data-variant": variant,
    "data-size": size,
    "aria-label": label,
    title: label,
    "aria-pressed": pressed == null ? undefined : String(pressed)
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: iconSize
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/brand/PixelLogo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Pixel grid sampled programmatically (9px cells, 50×35) from assets/logo/lockup-light-source.png.
// It is a faithful raster sample of the supplied mark, used only for the assembly animation.
// For static brand placement prefer the PNGs in assets/logo/.
const GRID = ["00000000000000000000000000000000000000000110000000", "00000000000000000000000000000000000000001111000000", "00000000000000000000000000000000000000011111100000", "00000000000001111111111100000000000000001111000000", "00000000000011111111111100000000000000000110000000", "00000000000111111111111100000000000000000000000000", "00000000001111111111111100000000000110110000000000", "00000000001111110000000000000000100000000000011000", "00000000001111000000000000000100000000000000001100", "00000000001111100000000000100000000000000000000110", "00000000001111111111110000000000000000000000000011", "00000000000111111111111000000000000000000000000011", "00000000000011111111111100000000000000000000000011", "00000000000001111111111110000000000000000000000011", "00000000000000000000011111000000001111000000000011", "00000000000000000000111111000000001111000000000110", "00000000011000000001111111000000001111000000000110", "00000000000000000001111111000000001111000000001100", "00000011000000000001111111000000001111000000001000", "00000100001111111111111100011100001111000000010000", "00000000001111111111111100011100001111000000000000", "00011000001111111111111000111110001111000011000000", "00100000001111111111111001111110001111000010000000", "00100000000000000001111001111111001111010000000000", "01000000000000000001111011111111101111000000000000", "01000000000000000001111111111111111111000000000000", "10000000000000000001111111111111111111000000000000", "10000000000000000001111111110111111111000000000000", "10000000000000000000111111100011111110000000000000", "10000000000000000000011111100011111100000000000000", "01000000000000000000001110000000111000000000000000", "01100000000000000000001110000000111000000000000000", "00111000000000000100000000000000000000000000000000", "00011111111001100000000000000000000000000000000000", "00000111111100000000000000000000000000000000000000"];
const COLS = 50,
  ROWS = 35;
function seeded(i) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}
const CELLS = [];
GRID.forEach((row, r) => {
  for (let c = 0; c < COLS; c++) if (row[c] === '1') CELLS.push({
    r,
    c,
    k: CELLS.length
  });
});
function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function PixelLogo({
  size = 120,
  animate = true,
  interactive = false,
  replayKey,
  duration = 900,
  title = 'Sumchenko Works',
  className = '',
  style,
  ...rest
}) {
  const [built, setBuilt] = React.useState(!animate || reducedMotion());
  const [ptr, setPtr] = React.useState(null);
  const raf = React.useRef(0);
  React.useEffect(() => {
    if (!animate || reducedMotion()) {
      setBuilt(true);
      return;
    }
    setBuilt(false);
    const t = setTimeout(() => setBuilt(true), 40);
    return () => clearTimeout(t);
  }, [animate, replayKey]);
  const onMove = interactive ? e => {
    const b = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width * COLS,
      y = (e.clientY - b.top) / b.height * ROWS;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => setPtr({
      x,
      y
    }));
  } : undefined;
  const onLeave = interactive ? () => {
    cancelAnimationFrame(raf.current);
    setPtr(null);
  } : undefined;
  const travel = duration * 0.55,
    spread = duration - travel;
  const w = size,
    h = size * ROWS / COLS;
  return /*#__PURE__*/React.createElement("svg", _extends({
    className: className,
    width: w,
    height: h,
    viewBox: '0 0 ' + COLS + ' ' + ROWS,
    role: "img",
    "aria-label": title,
    shapeRendering: "crispEdges",
    onPointerMove: onMove,
    onPointerLeave: onLeave,
    style: Object.assign({
      display: 'block',
      overflow: 'visible',
      color: 'var(--fg)'
    }, style)
  }, rest), CELLS.map(p => {
    const j1 = seeded(p.k + 1),
      j2 = seeded(p.k + 7),
      j3 = seeded(p.k + 13);
    let tx = 0,
      ty = 0,
      op = 1;
    if (!built) {
      tx = (j1 - 0.5) * 18;
      ty = (j2 - 0.5) * 12 - 4;
      op = 0;
    } else if (ptr) {
      const dx = p.c + 0.5 - ptr.x,
        dy = p.r + 0.5 - ptr.y,
        d = Math.hypot(dx, dy);
      if (d < 5 && d > 0.01) {
        const f = (1 - d / 5) * 0.9;
        tx = dx / d * f;
        ty = dy / d * f;
      }
    }
    const delay = built && !ptr ? Math.round(p.c / COLS * spread * 0.7 + j3 * spread * 0.3) : 0;
    const tr = ptr ? 'transform 160ms var(--ease-out)' : 'transform ' + travel + 'ms var(--ease-out) ' + delay + 'ms, opacity ' + Math.round(travel * 0.5) + 'ms linear ' + delay + 'ms';
    return /*#__PURE__*/React.createElement("rect", {
      key: p.k,
      x: p.c,
      y: p.r,
      width: "1.02",
      height: "1.02",
      fill: "currentColor",
      style: {
        transform: 'translate(' + tx + 'px,' + ty + 'px)',
        opacity: op,
        transition: tr
      }
    });
  }));
}
Object.assign(__ds_scope, { PixelLogo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/PixelLogo.jsx", error: String((e && e.message) || e) }); }

// components/brand/SectionHead.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionHead({
  index,
  title,
  meta,
  size = 'lg',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ('sw-section-head ' + className).trim(),
    "data-size": size
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sw-section-head__idx"
  }, index), /*#__PURE__*/React.createElement("div", {
    className: "sw-section-head__main"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sw-section-head__title"
  }, title), meta ? /*#__PURE__*/React.createElement("div", {
    className: "sw-section-head__meta"
  }, meta) : null));
}
function Coord({
  x,
  y,
  children,
  cross = true,
  className = '',
  ...rest
}) {
  const pad = n => typeof n === 'number' ? String(Math.round(n)).padStart(3, '0') : n;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ('sw-coord ' + className).trim()
  }, rest), cross ? /*#__PURE__*/React.createElement("span", {
    className: "sw-coord__cross",
    "aria-hidden": "true"
  }) : null, children != null ? children : /*#__PURE__*/React.createElement("span", null, "X ", pad(x), " \xB7 Y ", pad(y)));
}
Object.assign(__ds_scope, { SectionHead, Coord });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SectionHead.jsx", error: String((e && e.message) || e) }); }

// components/brand/ThemeToggle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function readTheme() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') || 'light';
}
function ThemeToggle({
  size = 'md',
  variant = 'outline',
  target,
  onChange,
  storageKey = 'sw-theme',
  ...rest
}) {
  const [theme, setTheme] = React.useState(readTheme);
  React.useEffect(() => {
    try {
      const s = localStorage.getItem(storageKey);
      if (s) {
        apply(s, false);
      }
    } catch (e) {}
  }, []);
  function apply(next, animate) {
    const el = target || document.documentElement;
    const run = () => {
      el.setAttribute('data-theme', next);
      setTheme(next);
    };
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (animate && !reduce && document.startViewTransition && !target) document.startViewTransition(run);else run();
    try {
      localStorage.setItem(storageKey, next);
    } catch (e) {}
    if (onChange) onChange(next);
  }
  const next = theme === 'dark' ? 'light' : 'dark';
  return /*#__PURE__*/React.createElement(__ds_scope.IconButton, _extends({
    icon: theme === 'dark' ? 'sun' : 'moon',
    label: next === 'dark' ? 'Тёмная тема' : 'Светлая тема',
    size: size,
    variant: variant,
    onClick: () => apply(next, true)
  }, rest));
}
Object.assign(__ds_scope, { ThemeToggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/ThemeToggle.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Badge({
  variant = 'solid',
  dot = false,
  pulse = false,
  className = '',
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ('sw-badge ' + className).trim(),
    "data-variant": variant
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    className: "sw-badge__dot",
    "data-pulse": pulse ? 'true' : undefined
  }) : null, children);
}
function Tag({
  size = 'md',
  hash = false,
  selected,
  onRemove,
  onClick,
  className = '',
  children,
  ...rest
}) {
  const isButton = !!onClick || selected != null;
  const T = isButton ? 'button' : 'span';
  return /*#__PURE__*/React.createElement(T, _extends({
    className: ('sw-tag ' + className).trim(),
    "data-size": size,
    type: isButton ? 'button' : undefined,
    "aria-pressed": selected == null ? undefined : String(selected),
    onClick: onClick
  }, rest), hash ? /*#__PURE__*/React.createElement("span", {
    className: "sw-tag__hash"
  }, "#") : null, /*#__PURE__*/React.createElement("span", null, children), onRemove ? /*#__PURE__*/React.createElement("span", {
    role: "button",
    tabIndex: 0,
    "aria-label": "\u0423\u0431\u0440\u0430\u0442\u044C",
    className: "sw-tag__x",
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "close",
    size: 12
  })) : null);
}
Object.assign(__ds_scope, { Badge, Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  variant = 'surface',
  padding = 'md',
  interactive,
  ticks,
  href,
  as,
  className = '',
  children,
  ...rest
}) {
  const isLink = !!href;
  const isInteractive = interactive != null ? interactive : isLink || !!rest.onClick;
  const Tag = as || (isLink ? 'a' : 'div');
  const extra = {};
  if (isLink) extra.href = href;
  if (isInteractive && !isLink && Tag === 'div') {
    extra.tabIndex = 0;
    extra.role = 'button';
  }
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: ('sw-card ' + className).trim(),
    "data-variant": variant,
    "data-padding": padding,
    "data-interactive": isInteractive ? 'true' : undefined,
    "data-ticks": ticks ? 'always' : undefined
  }, extra, rest), isInteractive || ticks ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "sw-card__tick",
    "data-c": "tl",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sw-card__tick",
    "data-c": "tr",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sw-card__tick",
    "data-c": "bl",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sw-card__tick",
    "data-c": "br",
    "aria-hidden": "true"
  })) : null, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/SpecList.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SpecList({
  items = [],
  dashed = false,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("dl", _extends({
    className: ('sw-spec ' + className).trim(),
    "data-dashed": dashed ? 'true' : undefined
  }, rest), items.map((it, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("dt", null, it.label), /*#__PURE__*/React.createElement("dd", null, it.value))));
}
Object.assign(__ds_scope, { SpecList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/SpecList.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open,
  onClose,
  label = 'DIALOG',
  title,
  children,
  footer,
  contained = false,
  width = 520
}) {
  React.useEffect(() => {
    if (!open) return;
    const k = e => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "sw-dialog-overlay",
    "data-contained": contained ? 'true' : undefined,
    onMouseDown: e => {
      if (e.target === e.currentTarget && onClose) onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sw-dialog",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": typeof title === 'string' ? title : undefined,
    style: {
      maxWidth: width
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sw-dialog__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, label), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "close",
    label: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
    size: "sm",
    variant: "bare",
    onClick: onClose,
    autoFocus: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "sw-dialog__body"
  }, title ? /*#__PURE__*/React.createElement("h2", {
    className: "sw-dialog__title"
  }, title) : null, typeof children === 'string' ? /*#__PURE__*/React.createElement("p", {
    className: "sw-dialog__text"
  }, children) : children), footer ? /*#__PURE__*/React.createElement("div", {
    className: "sw-dialog__foot"
  }, footer) : null));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Toast({
  title,
  children,
  variant = 'inverse',
  icon,
  duration = 0,
  onClose,
  className = '',
  ...rest
}) {
  React.useEffect(() => {
    if (!duration || !onClose) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ('sw-toast ' + className).trim(),
    "data-variant": variant,
    role: "status",
    "aria-live": "polite"
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16,
    style: {
      marginTop: 1
    }
  }) : null, /*#__PURE__*/React.createElement("div", {
    className: "sw-toast__body"
  }, title ? /*#__PURE__*/React.createElement("div", {
    className: "sw-toast__title"
  }, title) : null, children ? /*#__PURE__*/React.createElement("div", {
    className: "sw-toast__msg"
  }, children) : null), onClose ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sw-toast__close",
    "aria-label": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "close",
    size: 14
  })) : null, duration ? /*#__PURE__*/React.createElement("span", {
    className: "sw-toast__bar",
    style: {
      animation: 'sw-toast-bar ' + duration + 'ms linear forwards'
    }
  }) : null);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tooltip({
  content,
  side = 'top',
  shortcut,
  open,
  children,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ('sw-tooltip ' + className).trim(),
    "data-side": side,
    "data-open": open ? 'true' : undefined
  }, rest), children, /*#__PURE__*/React.createElement("span", {
    className: "sw-tooltip__bubble",
    role: "tooltip"
  }, content, shortcut ? /*#__PURE__*/React.createElement("span", {
    className: "sw-tooltip__kbd"
  }, shortcut) : null));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  description,
  disabled,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: ('sw-check ' + className).trim(),
    "data-type": "checkbox",
    "data-disabled": disabled ? 'true' : undefined
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "sw-check__box"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14
  })), /*#__PURE__*/React.createElement("span", null, label, description ? /*#__PURE__*/React.createElement("span", {
    className: "sw-check__desc"
  }, description) : null));
}
function Radio({
  label,
  description,
  disabled,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: ('sw-check ' + className).trim(),
    "data-type": "radio",
    "data-disabled": disabled ? 'true' : undefined
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "sw-check__box"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-check__dot"
  })), /*#__PURE__*/React.createElement("span", null, label, description ? /*#__PURE__*/React.createElement("span", {
    className: "sw-check__desc"
  }, description) : null));
}
Object.assign(__ds_scope, { Checkbox, Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _uid = 0;
function useId(id) {
  const r = React.useRef(id || 'sw-f' + ++_uid);
  return r.current;
}
function Field({
  label,
  hint,
  error,
  aside,
  htmlFor,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sw-field",
    "data-invalid": error ? 'true' : undefined
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "sw-field__label",
    htmlFor: htmlFor
  }, /*#__PURE__*/React.createElement("span", null, label), aside ? /*#__PURE__*/React.createElement("span", null, aside) : null) : null, children, error || hint ? /*#__PURE__*/React.createElement("div", {
    className: "sw-field__hint"
  }, error || hint) : null);
}
function Input({
  label,
  hint,
  error,
  aside,
  icon,
  multiline = false,
  id,
  className = '',
  ...rest
}) {
  const fid = useId(id);
  const Tag = multiline ? 'textarea' : 'input';
  const control = /*#__PURE__*/React.createElement(Tag, _extends({
    id: fid,
    className: ('sw-input ' + className).trim(),
    "data-has-prefix": icon ? 'true' : undefined,
    "aria-invalid": error ? 'true' : undefined
  }, rest));
  return /*#__PURE__*/React.createElement(Field, {
    label: label,
    hint: hint,
    error: error,
    aside: aside,
    htmlFor: fid
  }, icon ? /*#__PURE__*/React.createElement("div", {
    className: "sw-input-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-input-wrap__prefix"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  })), control) : control);
}
Object.assign(__ds_scope, { Field, Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _uid = 0;
function Select({
  label,
  hint,
  error,
  aside,
  options = [],
  id,
  className = '',
  ...rest
}) {
  const ref = React.useRef(id || 'sw-s' + ++_uid);
  return /*#__PURE__*/React.createElement(__ds_scope.Field, {
    label: label,
    hint: hint,
    error: error,
    aside: aside,
    htmlFor: ref.current
  }, /*#__PURE__*/React.createElement("div", {
    className: "sw-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: ref.current,
    className: ('sw-select ' + className).trim()
  }, rest), options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value,
      disabled: opt.disabled
    }, opt.label);
  })), /*#__PURE__*/React.createElement("span", {
    className: "sw-select-wrap__chev"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  label,
  showState = true,
  onLabel = 'ON',
  offLabel = 'OFF',
  checked,
  defaultChecked,
  onChange,
  disabled,
  className = '',
  ...rest
}) {
  const controlled = checked != null;
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = controlled ? checked : inner;
  const handle = e => {
    if (!controlled) setInner(e.target.checked);
    if (onChange) onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    className: ('sw-switch ' + className).trim(),
    "data-disabled": disabled ? 'true' : undefined
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    checked: on,
    onChange: handle,
    disabled: disabled,
    "aria-checked": on
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "sw-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-switch__thumb"
  })), label ? /*#__PURE__*/React.createElement("span", null, label) : null, showState ? /*#__PURE__*/React.createElement("span", {
    className: "sw-switch__state"
  }, on ? onLabel : offLabel) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/graphics/IsoDiagram.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const C30 = Math.cos(Math.PI / 6),
  S30 = 0.5;
const DEFAULT_NODES = [{
  id: 'client',
  label: 'CLIENT',
  sub: 'web · mobile',
  x: 0,
  y: 0,
  w: 2,
  d: 2,
  h: 0.5
}, {
  id: 'gw',
  label: 'API GATEWAY',
  sub: 'auth · rate limit',
  x: 4,
  y: 0,
  w: 2,
  d: 2,
  h: 1
}, {
  id: 'svc',
  label: 'SERVICES',
  sub: '3 × go',
  x: 8,
  y: 0,
  w: 2,
  d: 2,
  h: 2
}, {
  id: 'queue',
  label: 'QUEUE',
  sub: 'kafka',
  x: 4,
  y: 4,
  w: 2,
  d: 1,
  h: 0.5
}, {
  id: 'db',
  label: 'DATA',
  sub: 'postgres',
  x: 8,
  y: 4,
  w: 2,
  d: 2,
  h: 1.5
}];
const DEFAULT_LINKS = [['client', 'gw'], ['gw', 'svc'], ['gw', 'queue'], ['queue', 'db'], ['svc', 'db']];
function reduced() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function IsoDiagram({
  nodes = DEFAULT_NODES,
  links = DEFAULT_LINKS,
  unit = 28,
  animate = true,
  replayKey,
  grid = true,
  labels = true,
  highlight,
  onNodeHover,
  className = '',
  style,
  ...rest
}) {
  const [drawn, setDrawn] = React.useState(!animate || reduced());
  const [hover, setHover] = React.useState(null);
  React.useEffect(() => {
    if (!animate || reduced()) {
      setDrawn(true);
      return;
    }
    setDrawn(false);
    const t = setTimeout(() => setDrawn(true), 40);
    return () => clearTimeout(t);
  }, [animate, replayKey]);
  const P = (x, y, z) => [(x - y) * C30 * unit, (x + y) * S30 * unit - z * unit];
  const pts = arr => arr.map(p => P(p[0], p[1], p[2]).map(v => v.toFixed(1)).join(',')).join(' ');
  const byId = {};
  nodes.forEach(n => {
    byId[n.id] = n;
  });
  let minX = 1e9,
    minY = 1e9,
    maxX = -1e9,
    maxY = -1e9;
  const grow = p => {
    minX = Math.min(minX, p[0]);
    maxX = Math.max(maxX, p[0]);
    minY = Math.min(minY, p[1]);
    maxY = Math.max(maxY, p[1]);
  };
  let gx = 0,
    gy = 0;
  nodes.forEach(n => {
    gx = Math.max(gx, n.x + n.w);
    gy = Math.max(gy, n.y + n.d);
    [[n.x, n.y, 0], [n.x + n.w, n.y, 0], [n.x, n.y + n.d, 0], [n.x + n.w, n.y + n.d, 0], [n.x, n.y, labels ? n.h + 1.6 : n.h]].forEach(p => grow(P(p[0], p[1], p[2])));
  });
  gx += 1;
  gy += 1;
  [[-1, -1], [gx, -1], [-1, gy], [gx, gy]].forEach(p => grow(P(p[0], p[1], 0)));
  const pad = 12;
  const vb = [minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2];
  const order = nodes.slice().sort((a, b) => a.x + a.y - (b.x + b.y));
  const step = 110;
  const T = (i, extra) => drawn ? 'stroke-dashoffset var(--dur-draw) var(--ease-in-out) ' + (i * step + (extra || 0)) + 'ms, fill-opacity var(--dur-slow) linear ' + (i * step + 500) + 'ms, opacity var(--dur-slow) linear ' + (i * step + (extra || 0)) + 'ms' : 'none';
  const dots = [];
  if (grid) for (let i = -1; i <= gx; i++) for (let j = -1; j <= gy; j++) {
    const p = P(i, j, 0);
    dots.push(/*#__PURE__*/React.createElement("rect", {
      key: i + '_' + j,
      x: p[0] - 0.75,
      y: p[1] - 0.75,
      width: "1.5",
      height: "1.5",
      fill: "var(--fg-3)"
    }));
  }
  const hot = highlight || hover;
  return /*#__PURE__*/React.createElement("svg", _extends({
    className: className,
    viewBox: vb.join(' '),
    width: "100%",
    role: "img",
    "aria-label": "\u0421\u0445\u0435\u043C\u0430 \u0430\u0440\u0445\u0438\u0442\u0435\u043A\u0442\u0443\u0440\u044B",
    style: Object.assign({
      display: 'block',
      overflow: 'visible',
      fontFamily: 'var(--font-mono)'
    }, style)
  }, rest), /*#__PURE__*/React.createElement("g", {
    style: {
      opacity: drawn ? 1 : 0,
      transition: drawn ? 'opacity 400ms linear' : 'none'
    }
  }, dots), links.map((l, i) => {
    const a = byId[l[0]],
      b = byId[l[1]];
    if (!a || !b) return null;
    const ax = a.x + a.w / 2,
      ay = a.y + a.d / 2,
      bx = b.x + b.w / 2,
      by = b.y + b.d / 2;
    const route = [[ax, ay, 0], [bx, ay, 0], [bx, by, 0]];
    const on = hot && (l[0] === hot || l[1] === hot);
    return /*#__PURE__*/React.createElement("polyline", {
      key: 'l' + i,
      points: pts(route),
      fill: "none",
      stroke: on ? 'var(--fg)' : 'var(--fg-3)',
      strokeWidth: "1",
      strokeDasharray: "3 3",
      style: {
        opacity: drawn ? 1 : 0,
        transition: T(i + 1, 300) + ', stroke 140ms'
      }
    });
  }), order.map((n, i) => {
    const x0 = n.x,
      y0 = n.y,
      x1 = n.x + n.w,
      y1 = n.y + n.d,
      h = n.h;
    const top = [[x0, y0, h], [x1, y0, h], [x1, y1, h], [x0, y1, h]];
    const right = [[x1, y0, 0], [x1, y1, 0], [x1, y1, h], [x1, y0, h]];
    const front = [[x0, y1, 0], [x1, y1, 0], [x1, y1, h], [x0, y1, h]];
    const on = hot === n.id;
    const face = (p, fill, k) => /*#__PURE__*/React.createElement("polygon", {
      key: k,
      points: pts(p),
      pathLength: "1",
      fill: fill,
      fillOpacity: drawn ? 1 : 0,
      stroke: "var(--fg)",
      strokeWidth: on ? 1.5 : 1,
      strokeLinejoin: "miter",
      strokeDasharray: "1",
      strokeDashoffset: drawn ? 0 : 1,
      style: {
        transition: T(i)
      }
    });
    return /*#__PURE__*/React.createElement("g", {
      key: n.id,
      onPointerEnter: () => {
        setHover(n.id);
        if (onNodeHover) onNodeHover(n.id);
      },
      onPointerLeave: () => {
        setHover(null);
        if (onNodeHover) onNodeHover(null);
      },
      style: {
        cursor: onNodeHover ? 'pointer' : 'default'
      }
    }, face(front, on ? 'var(--fg)' : 'var(--bg)', 'f'), face(right, 'var(--surface-2)', 'r'), face(top, 'var(--surface)', 't'));
  }), labels && order.map((n, i) => {
    const lp = P(n.x + n.w / 2, n.y + n.d / 2, n.h);
    return /*#__PURE__*/React.createElement("g", {
      key: 'lab' + n.id,
      pointerEvents: "none",
      style: {
        paintOrder: 'stroke'
      }
    }, /*#__PURE__*/React.createElement("g", {
      style: {
        opacity: drawn ? 1 : 0,
        transition: T(i, 600)
      }
    }, /*#__PURE__*/React.createElement("line", {
      x1: lp[0],
      y1: lp[1],
      x2: lp[0],
      y2: lp[1] - unit * 1.1,
      stroke: "var(--fg)",
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("rect", {
      x: lp[0] - 1.5,
      y: lp[1] - 1.5,
      width: "3",
      height: "3",
      fill: "var(--fg)"
    }), /*#__PURE__*/React.createElement("text", {
      stroke: "var(--bg)",
      strokeWidth: "3",
      strokeLinejoin: "round",
      x: lp[0] + 6,
      y: lp[1] - unit * 1.1 + 3,
      fontSize: "10",
      letterSpacing: "0.06em",
      fill: "var(--fg)"
    }, n.label), n.sub ? /*#__PURE__*/React.createElement("text", {
      stroke: "var(--bg)",
      strokeWidth: "3",
      strokeLinejoin: "round",
      x: lp[0] + 6,
      y: lp[1] - unit * 1.1 + 15,
      fontSize: "9",
      fill: "var(--fg-2)"
    }, n.sub) : null));
  }));
}
Object.assign(__ds_scope, { IsoDiagram });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/graphics/IsoDiagram.jsx", error: String((e && e.message) || e) }); }

// components/graphics/PixelField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function reduced() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function PixelField({
  cell = 16,
  dot = 2,
  radius = 96,
  height = 240,
  flicker = true,
  className = '',
  style,
  ...rest
}) {
  const wrap = React.useRef(null);
  const cvs = React.useRef(null);
  React.useEffect(() => {
    const el = wrap.current,
      c = cvs.current;
    if (!el || !c) return;
    const ctx = c.getContext('2d');
    let W = 0,
      H = 0,
      cols = 0,
      rows = 0,
      energy = [],
      ptr = null,
      raf = 0,
      last = 0,
      alive = true;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const still = reduced();
    function colors() {
      const cs = getComputedStyle(el);
      return {
        fg: cs.getPropertyValue('--fg').trim() || '#111',
        dim: cs.getPropertyValue('--fg-3').trim() || '#aaa'
      };
    }
    let col = colors();
    function resize() {
      W = el.clientWidth;
      H = el.clientHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      c.style.width = W + 'px';
      c.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / cell);
      rows = Math.ceil(H / cell);
      energy = new Float32Array(cols * rows);
      draw();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
        const e = energy[r * cols + q];
        const s = dot + (cell * 0.62 - dot) * e;
        const x = q * cell + (cell - s) / 2,
          y = r * cell + (cell - s) / 2;
        ctx.globalAlpha = e > 0.02 ? 0.35 + 0.65 * e : 0.55;
        ctx.fillStyle = e > 0.02 ? col.fg : col.dim;
        ctx.fillRect(Math.round(x), Math.round(y), Math.round(s), Math.round(s));
      }
      ctx.globalAlpha = 1;
    }
    function tick(t) {
      if (!alive) return;
      const dt = Math.min(48, t - (last || t));
      last = t;
      let active = false;
      for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
        const i = r * cols + q;
        let target = 0;
        if (ptr) {
          const d = Math.hypot(q * cell + cell / 2 - ptr.x, r * cell + cell / 2 - ptr.y);
          if (d < radius) target = Math.round((1 - d / radius) * 4) / 4;
        }
        const e = energy[i];
        const k = target > e ? 0.35 : 0.06 * (dt / 16);
        energy[i] = e + (target - e) * k;
        if (energy[i] > 0.01) active = true;
      }
      if (flicker && Math.random() < 0.08) {
        const i = Math.random() * energy.length | 0;
        energy[i] = Math.max(energy[i], 0.5);
        active = true;
      }
      draw();
      if (active || ptr || flicker) raf = requestAnimationFrame(tick);else raf = 0;
    }
    const kick = () => {
      if (!raf && !still) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    const move = e => {
      const b = el.getBoundingClientRect();
      ptr = {
        x: e.clientX - b.left,
        y: e.clientY - b.top
      };
      kick();
    };
    const leave = () => {
      ptr = null;
      kick();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const mo = new MutationObserver(() => {
      col = colors();
      draw();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    if (!still) {
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      if (flicker) kick();
    }
    resize();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [cell, dot, radius, flicker]);
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: wrap,
    className: className,
    "aria-hidden": "true",
    style: Object.assign({
      position: 'relative',
      width: '100%',
      height: height,
      overflow: 'hidden'
    }, style)
  }, rest), /*#__PURE__*/React.createElement("canvas", {
    ref: cvs,
    style: {
      position: 'absolute',
      inset: 0
    }
  }));
}
Object.assign(__ds_scope, { PixelField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/graphics/PixelField.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function NavBar({
  brand,
  links = [],
  current,
  onNavigate,
  actions,
  numbered = true,
  className = '',
  ...rest
}) {
  const [open, setOpen] = React.useState(false);
  const go = l => e => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(l.id);
    }
    setOpen(false);
  };
  const renderLinks = () => links.map((l, i) => /*#__PURE__*/React.createElement("a", {
    key: l.id,
    href: l.href || '#' + l.id,
    className: "sw-nav__link",
    "aria-current": l.id === current ? 'page' : undefined,
    onClick: go(l)
  }, numbered ? /*#__PURE__*/React.createElement("span", {
    className: "sw-nav__idx"
  }, String(i + 1).padStart(2, '0')) : null, /*#__PURE__*/React.createElement("span", null, l.label)));
  return /*#__PURE__*/React.createElement("header", _extends({
    className: ('sw-nav ' + className).trim()
  }, rest), brand, /*#__PURE__*/React.createElement("nav", {
    className: "sw-nav__links",
    "aria-label": "\u041E\u0441\u043D\u043E\u0432\u043D\u0430\u044F \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F"
  }, renderLinks()), /*#__PURE__*/React.createElement("div", {
    className: "sw-nav__actions"
  }, actions, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    className: "sw-nav__menu",
    icon: open ? 'close' : 'menu',
    label: open ? 'Закрыть меню' : 'Меню',
    variant: "bare",
    "aria-expanded": open,
    onClick: () => setOpen(!open)
  })), /*#__PURE__*/React.createElement("nav", {
    className: "sw-nav__sheet",
    "data-open": open ? 'true' : undefined,
    "aria-label": "\u041C\u043E\u0431\u0438\u043B\u044C\u043D\u0430\u044F \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F"
  }, renderLinks()));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'underline',
  numbered = false,
  renderPanel,
  className = '',
  ...rest
}) {
  const controlled = value != null;
  const [inner, setInner] = React.useState(defaultValue != null ? defaultValue : items[0] && items[0].id);
  const cur = controlled ? value : inner;
  const listRef = React.useRef(null);
  const select = id => {
    if (!controlled) setInner(id);
    if (onChange) onChange(id);
  };
  const onKey = e => {
    const i = items.findIndex(t => t.id === cur);
    let n = -1;
    if (e.key === 'ArrowRight') n = (i + 1) % items.length;
    if (e.key === 'ArrowLeft') n = (i - 1 + items.length) % items.length;
    if (n >= 0) {
      e.preventDefault();
      select(items[n].id);
      const b = listRef.current && listRef.current.querySelectorAll('[role=tab]')[n];
      if (b) b.focus();
    }
  };
  const active = items.find(t => t.id === cur);
  const panel = renderPanel ? renderPanel(cur) : active && active.content;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ('sw-tabs ' + className).trim(),
    "data-variant": variant
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sw-tabs__list",
    role: "tablist",
    ref: listRef,
    onKeyDown: onKey
  }, items.map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    role: "tab",
    type: "button",
    className: "sw-tab",
    "aria-selected": t.id === cur,
    tabIndex: t.id === cur ? 0 : -1,
    onClick: () => select(t.id)
  }, numbered ? /*#__PURE__*/React.createElement("span", {
    className: "sw-tab__idx"
  }, String(i + 1).padStart(2, '0')) : null, /*#__PURE__*/React.createElement("span", null, t.label), t.count != null ? /*#__PURE__*/React.createElement("span", {
    className: "sw-tab__count"
  }, t.count) : null))), panel != null ? /*#__PURE__*/React.createElement("div", {
    className: "sw-tabs__panel",
    role: "tabpanel",
    key: cur
  }, panel) : null);
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/CaseStudy.jsx
try { (() => {
function CaseStudy({
  id,
  tab,
  setTab,
  go,
  openCase,
  toast
}) {
  const {
    Button,
    Tabs,
    SpecList,
    IsoDiagram,
    Dialog,
    Icon,
    Tag,
    Coord
  } = DS;
  const D = window.SW_DATA;
  const p = D.projects.find(x => x.id === id) || D.projects[0];
  const [hot, setHot] = React.useState(null);
  const [doc, setDoc] = React.useState(null);
  const notes = p.notes || {};
  const next = D.projects[(D.projects.indexOf(p) + 1) % D.projects.length];
  const overview = /*#__PURE__*/React.createElement("div", {
    className: "k-prose"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, "\xA7 1"), /*#__PURE__*/React.createElement("div", {
    className: "k-prose__text"
  }, /*#__PURE__*/React.createElement("p", null, p.summary), /*#__PURE__*/React.createElement("h3", null, "\u0417\u0430\u0434\u0430\u0447\u0430"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--fg-2)'
    }
  }, "\u041F\u0440\u0438\u043C\u0435\u0440 \u0442\u0435\u043A\u0441\u0442\u0430 \u0440\u0430\u0437\u0431\u043E\u0440\u0430: \u043A\u0430\u043A\u0438\u0435 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u044F \u0431\u044B\u043B\u0438 \u0443 \u0441\u0438\u0441\u0442\u0435\u043C\u044B, \u043A\u0442\u043E \u0435\u0451 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438 \u0438 \u0447\u0442\u043E \u0441\u0447\u0438\u0442\u0430\u043B\u043E\u0441\u044C \u0443\u0441\u043F\u0435\u0448\u043D\u044B\u043C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u043C. \u0417\u0430\u043C\u0435\u043D\u0438\u0442\u0435 \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u043C \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435\u043C \u043F\u0440\u043E\u0435\u043A\u0442\u0430."), /*#__PURE__*/React.createElement("h3", null, "\u0420\u0435\u0448\u0435\u043D\u0438\u0435"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--fg-2)'
    }
  }, "\u041A\u043B\u044E\u0447\u0435\u0432\u044B\u0435 \u0430\u0440\u0445\u0438\u0442\u0435\u043A\u0442\u0443\u0440\u043D\u044B\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0444\u0438\u043A\u0441\u0438\u0440\u0443\u044E\u0442\u0441\u044F \u0432 ADR; \u0441\u0445\u0435\u043C\u0430 \u043D\u0430 \u0432\u043A\u043B\u0430\u0434\u043A\u0435 \xAB\u0410\u0440\u0445\u0438\u0442\u0435\u043A\u0442\u0443\u0440\u0430\xBB \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0438\u0442\u043E\u0433\u043E\u0432\u044B\u0435 \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u044B \u0438 \u0441\u0432\u044F\u0437\u0438.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, "\u0421\u0442\u0435\u043A"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, p.stack.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s,
    size: "sm",
    hash: true
  }, s)))));
  const arch = /*#__PURE__*/React.createElement("div", {
    className: "k-arch"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line)',
      background: 'var(--surface)',
      padding: 32,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label",
    style: {
      position: 'absolute',
      top: 14,
      left: 16
    }
  }, "FIG. ", p.code.slice(-2), " \u2014 \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u044B"), /*#__PURE__*/React.createElement(Coord, {
    style: {
      position: 'absolute',
      bottom: 14,
      right: 16
    },
    x: 0,
    y: 0
  }), /*#__PURE__*/React.createElement(IsoDiagram, {
    nodes: p.nodes,
    links: p.links,
    unit: 30,
    highlight: hot,
    onNodeHover: setHot
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-arch__list",
    "data-dim": hot ? 'true' : undefined
  }, p.nodes.map((n, i) => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    className: "k-arch__item",
    "data-on": hot === n.id ? 'true' : undefined,
    onPointerEnter: () => setHot(n.id),
    onPointerLeave: () => setHot(null)
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-mono",
    style: {
      fontSize: 12,
      letterSpacing: '.06em'
    }
  }, n.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--fg-2)',
      lineHeight: 1.45
    }
  }, notes[n.id] || n.sub || '—'))))));
  const docs = /*#__PURE__*/React.createElement("div", {
    className: "k-docs"
  }, D.docs.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.code,
    className: "k-doc"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file",
    size: 24
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, d.code), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, d.title)), /*#__PURE__*/React.createElement("span", {
    className: "sw-label k-hide-s"
  }, d.type, " \xB7 ", d.size), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    iconStart: "eye",
    onClick: () => setDoc(d)
  }, "\u041E\u0442\u043A\u0440\u044B\u0442\u044C"))));
  return /*#__PURE__*/React.createElement("div", {
    className: "k-page k-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    iconStart: "arrow-left",
    onClick: () => go('work')
  }, "\u0412\u0441\u0435 \u043F\u0440\u043E\u0435\u043A\u0442\u044B")), /*#__PURE__*/React.createElement("header", {
    className: "k-case-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-case-head__main"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, p.code, " \xB7 ", p.kindLabel), /*#__PURE__*/React.createElement(StatusBadge, {
    status: p.status
  })), /*#__PURE__*/React.createElement("h1", {
    className: "k-case-title"
  }, p.title)), /*#__PURE__*/React.createElement("div", {
    className: "k-case-head__side"
  }, /*#__PURE__*/React.createElement(SpecList, {
    items: [{
      label: 'Роль',
      value: p.role || p.kindLabel
    }, {
      label: 'Стек',
      value: p.stack.join(' · ')
    }, {
      label: 'Период',
      value: p.period || String(p.year)
    }, {
      label: 'Артефакты',
      value: D.docs.length + ' документов'
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    className: "k-case-body"
  }, /*#__PURE__*/React.createElement(Tabs, {
    numbered: true,
    value: tab,
    onChange: setTab,
    items: [{
      id: 'overview',
      label: 'Обзор'
    }, {
      id: 'arch',
      label: 'Архитектура'
    }, {
      id: 'docs',
      label: 'Документы',
      count: D.docs.length
    }],
    renderPanel: t => t === 'arch' ? arch : t === 'docs' ? docs : overview
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 'var(--space-section) 0',
      borderTop: '1px solid var(--line)',
      paddingTop: 24,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \xB7 ", next.code), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconEnd: "arrow-right",
    onClick: () => openCase(next.id)
  }, next.title)), /*#__PURE__*/React.createElement(Dialog, {
    open: !!doc,
    onClose: () => setDoc(null),
    label: doc ? 'ARTIFACT / ' + doc.code : '',
    title: doc && doc.title,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onClick: () => setDoc(null)
    }, "\u0417\u0430\u043A\u0440\u044B\u0442\u044C"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconStart: "download",
      onClick: () => {
        setDoc(null);
        toast('Загрузка', doc.code + ' · ' + doc.size);
      }
    }, "\u0421\u043A\u0430\u0447\u0430\u0442\u044C"))
  }, doc ? doc.type + ', ' + doc.size + '. Превью артефакта показывается здесь.' : ''));
}
window.CaseStudy = CaseStudy;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/CaseStudy.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Contact.jsx
try { (() => {
function Contact({
  toast
}) {
  const {
    Input,
    Select,
    Checkbox,
    Radio,
    Button,
    SpecList,
    PixelField
  } = DS;
  const D = window.SW_DATA;
  const [email, setEmail] = React.useState('');
  const [err, setErr] = React.useState(null);
  const [msg, setMsg] = React.useState('');
  const submit = e => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setErr('Проверьте адрес');
      return;
    }
    setErr(null);
    setEmail('');
    setMsg('');
    toast('Отправлено', 'Отвечу в течение двух рабочих дней.');
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "k-page k-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-contact"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, "04 / \u041A\u043E\u043D\u0442\u0430\u043A\u0442"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 'var(--text-display-m)',
      lineHeight: 'var(--lh-display)'
    }
  }, "\u0420\u0430\u0441\u0441\u043A\u0430\u0436\u0438\u0442\u0435", /*#__PURE__*/React.createElement("br", null), "\u043E \u0437\u0430\u0434\u0430\u0447\u0435"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--fg-2)',
      maxWidth: '40ch'
    }
  }, "\u041D\u043E\u0432\u044B\u0439 \u043F\u0440\u043E\u0434\u0443\u043A\u0442, \u0430\u0443\u0434\u0438\u0442 \u0430\u0440\u0445\u0438\u0442\u0435\u043A\u0442\u0443\u0440\u044B \u0438\u043B\u0438 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044F \u043A \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0439 \u0441\u0438\u0441\u0442\u0435\u043C\u0435 \u2014 \u043E\u043F\u0438\u0448\u0438\u0442\u0435 \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442, \u0438 \u044F \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0443 \u0444\u043E\u0440\u043C\u0430\u0442 \u0440\u0430\u0431\u043E\u0442\u044B."), /*#__PURE__*/React.createElement(SpecList, {
    items: [{
      label: 'Email',
      value: D.email
    }, {
      label: 'Ответ',
      value: '1–2 рабочих дня'
    }, {
      label: 'Формат',
      value: 'Удалённо · RU / EN'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement(PixelField, {
    height: 140,
    cell: 14
  }))), /*#__PURE__*/React.createElement("form", {
    className: "k-form",
    onSubmit: submit,
    noValidate: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-form__row"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "\u0418\u043C\u044F",
    placeholder: "\u041A\u0430\u043A \u043A \u0432\u0430\u043C \u043E\u0431\u0440\u0430\u0449\u0430\u0442\u044C\u0441\u044F"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    placeholder: "name@domain.com",
    value: email,
    onChange: e => {
      setEmail(e.target.value);
      if (err) setErr(null);
    },
    error: err
  })), /*#__PURE__*/React.createElement(Select, {
    label: "\u0422\u0438\u043F \u0437\u0430\u0434\u0430\u0447\u0438",
    options: ['Разработка', 'Системный анализ', 'Проектирование', 'Консультация']
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435",
    multiline: true,
    rows: 5,
    placeholder: "\u041A\u043E\u043D\u0442\u0435\u043A\u0441\u0442, \u0441\u0440\u043E\u043A\u0438, \u0447\u0442\u043E \u0443\u0436\u0435 \u0435\u0441\u0442\u044C",
    aside: msg.length + '/600',
    maxLength: 600,
    value: msg,
    onChange: e => setMsg(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label",
    style: {
      width: '100%'
    }
  }, "\u0423\u0434\u043E\u0431\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442"), /*#__PURE__*/React.createElement(Radio, {
    name: "fmt",
    value: "call",
    label: "\u0421\u043E\u0437\u0432\u043E\u043D",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(Radio, {
    name: "fmt",
    value: "mail",
    label: "\u041F\u0435\u0440\u0435\u043F\u0438\u0441\u043A\u0430"
  })), /*#__PURE__*/React.createElement(Checkbox, {
    label: "\u0421\u043E\u0433\u043B\u0430\u0441\u0435\u043D \u043D\u0430 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0443 \u0434\u0430\u043D\u043D\u044B\u0445",
    description: "\u0422\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F \u043E\u0442\u0432\u0435\u0442\u0430 \u043D\u0430 \u044D\u0442\u043E \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "lg",
    iconEnd: "arrow-right"
  }, "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C")))));
}
window.Contact = Contact;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Home.jsx
try { (() => {
function Home({
  go,
  openCase,
  toast
}) {
  const {
    Button,
    PixelLogo,
    PixelField,
    SectionHead,
    Coord,
    IsoDiagram,
    SpecList,
    Tag,
    Card,
    Icon
  } = DS;
  const D = window.SW_DATA;
  const featured = D.projects[0];
  const [hot, setHot] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    className: "k-page"
  }, /*#__PURE__*/React.createElement("section", {
    className: "k-hero k-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-hero__text"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, "SW\u201400 / \u0418\u043D\u0434\u0435\u043A\u0441"), /*#__PURE__*/React.createElement(Coord, {
    x: 0,
    y: 0
  })), /*#__PURE__*/React.createElement("h1", {
    className: "k-hero__title"
  }, "\u0418\u0434\u0435\u0438,", /*#__PURE__*/React.createElement("br", null), "\u0441\u0438\u0441\u0442\u0435\u043C\u044B,", /*#__PURE__*/React.createElement("br", null), "\u043F\u0440\u043E\u0434\u0443\u043A\u0442\u044B."), /*#__PURE__*/React.createElement("p", {
    className: "k-hero__lead"
  }, "\u041F\u043E\u0440\u0442\u0444\u043E\u043B\u0438\u043E \u0446\u0438\u0444\u0440\u043E\u0432\u044B\u0445 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432, \u043E\u0431\u044A\u0435\u0434\u0438\u043D\u044F\u044E\u0449\u0435\u0435 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0443, \u0441\u0438\u0441\u0442\u0435\u043C\u043D\u044B\u0439 \u0430\u043D\u0430\u043B\u0438\u0437 \u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u043D\u044B\u0445 \u0440\u0435\u0448\u0435\u043D\u0438\u0439."), /*#__PURE__*/React.createElement("div", {
    className: "k-actions"
  }, /*#__PURE__*/React.createElement(Button, {
    iconEnd: "arrow-right",
    onClick: () => go('work')
  }, "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0442\u044B"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => go('contact')
  }, "\u0421\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F"))), /*#__PURE__*/React.createElement("div", {
    className: "k-hero__art"
  }, /*#__PURE__*/React.createElement(PixelField, {
    height: "100%",
    cell: 16,
    radius: 120,
    style: {
      position: 'absolute',
      inset: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: 24,
      background: 'var(--bg)'
    }
  }, /*#__PURE__*/React.createElement(PixelLogo, {
    size: 260,
    interactive: true
  })), /*#__PURE__*/React.createElement(Coord, {
    className: "k-c",
    style: {
      top: 12,
      left: 12
    },
    x: 0,
    y: 0
  }), /*#__PURE__*/React.createElement(Coord, {
    className: "k-c",
    style: {
      bottom: 12,
      right: 12
    },
    x: 512,
    y: 512
  }), /*#__PURE__*/React.createElement("span", {
    className: "sw-label k-c",
    style: {
      top: 14,
      right: 14
    }
  }, "FIG. 00"))), /*#__PURE__*/React.createElement("div", {
    className: "k-disc"
  }, D.disciplines.map((d, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: d.id,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, d.idx), /*#__PURE__*/React.createElement("h3", null, d.title), /*#__PURE__*/React.createElement("p", null, d.text))))), /*#__PURE__*/React.createElement("section", {
    className: "k-section k-wrap"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    index: "01 / \u0420\u0430\u0431\u043E\u0442\u044B",
    title: "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435",
    meta: D.projects.length + ' проектов · 2024—2026'
  }), /*#__PURE__*/React.createElement(Reveal, {
    className: "k-feature"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-feature__art"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label",
    style: {
      position: 'absolute',
      top: 16,
      left: 16
    }
  }, "FIG. 03 \u2014 \u0430\u0440\u0445\u0438\u0442\u0435\u043A\u0442\u0443\u0440\u0430"), /*#__PURE__*/React.createElement(IsoDiagram, {
    nodes: featured.nodes,
    links: featured.links,
    unit: 26,
    highlight: hot,
    onNodeHover: setHot,
    style: {
      maxHeight: 420
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-feature__body"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, featured.code, " \xB7 ", featured.year), /*#__PURE__*/React.createElement(StatusBadge, {
    status: featured.status
  })), /*#__PURE__*/React.createElement("h3", {
    className: "k-feature__title"
  }, featured.title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--fg-2)'
    }
  }, featured.summary), /*#__PURE__*/React.createElement(SpecList, {
    items: [{
      label: 'Роль',
      value: featured.role
    }, {
      label: 'Стек',
      value: featured.stack.join(' · ')
    }, {
      label: 'Период',
      value: featured.period
    }]
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconEnd: "arrow-right",
    onClick: () => openCase(featured.id)
  }, "\u0420\u0430\u0437\u0431\u043E\u0440 \u043F\u0440\u043E\u0435\u043A\u0442\u0430")))), /*#__PURE__*/React.createElement("div", {
    className: "k-rows",
    style: {
      marginTop: 40
    }
  }, D.projects.slice(1, 5).map((p, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: p.id,
    delay: i * 50
  }, /*#__PURE__*/React.createElement("a", {
    className: "k-row",
    href: '#' + p.id,
    onClick: e => {
      e.preventDefault();
      openCase(p.id);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, p.code), /*#__PURE__*/React.createElement("span", {
    className: "k-row__title"
  }, p.title), /*#__PURE__*/React.createElement("span", {
    className: "sw-label k-hide-s"
  }, p.kindLabel), /*#__PURE__*/React.createElement("span", {
    className: "sw-mono k-hide-s",
    style: {
      fontSize: 12,
      color: 'var(--fg-2)'
    }
  }, p.year), /*#__PURE__*/React.createElement("span", {
    className: "k-row__go"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right"
  }))))))), /*#__PURE__*/React.createElement("section", {
    className: "k-section k-wrap"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    index: "02 / \u041F\u043E\u0434\u0445\u043E\u0434",
    title: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043C\u043E\u0434\u0435\u043B\u044C, \u043F\u043E\u0442\u043E\u043C \u043A\u043E\u0434"
  }), /*#__PURE__*/React.createElement("div", {
    className: "k-steps"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-steps__line"
  }), D.steps.map((s, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: s.idx,
    className: "k-step",
    delay: i * 90
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, s.idx), /*#__PURE__*/React.createElement("h3", null, s.title), /*#__PURE__*/React.createElement("p", null, s.text))))), /*#__PURE__*/React.createElement("section", {
    className: "k-section k-wrap"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    index: "03 / \u0410\u0440\u0442\u0435\u0444\u0430\u043A\u0442\u044B",
    title: "\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044F",
    meta: "\u0427\u0430\u0441\u0442\u044C \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430"
  }), /*#__PURE__*/React.createElement("div", {
    className: "k-arts"
  }, D.artifacts.map((a, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: a.code,
    delay: i * 60
  }, /*#__PURE__*/React.createElement(Card, {
    className: "k-art",
    variant: i === 0 ? 'inverse' : 'surface',
    onClick: () => openCase(featured.id, 'docs')
  }, /*#__PURE__*/React.createElement("span", {
    className: "k-art__code"
  }, a.code), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      lineHeight: 1.35
    }
  }, a.title), /*#__PURE__*/React.createElement("span", {
    className: "sw-label",
    style: {
      color: 'inherit',
      opacity: .6
    }
  }, a.meta))))))), /*#__PURE__*/React.createElement("section", {
    className: "k-cta k-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-grid"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, "04 / \u041A\u043E\u043D\u0442\u0430\u043A\u0442"), /*#__PURE__*/React.createElement("h2", {
    className: "k-cta__title"
  }, "\u041E\u0431\u0441\u0443\u0434\u0438\u043C", /*#__PURE__*/React.createElement("br", null), "\u0441\u0438\u0441\u0442\u0435\u043C\u0443?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 24,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "k-mail",
    onClick: () => {
      try {
        navigator.clipboard.writeText(D.email);
      } catch (e) {}
      toast('Скопировано', D.email);
    }
  }, D.email, /*#__PURE__*/React.createElement(Icon, {
    name: "copy",
    size: 16
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconEnd: "arrow-right",
    onClick: () => go('contact')
  }, "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C"))))));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Shell.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DS = window.SumchenkoWorksDesignSystem_bf1cba;
function Reveal({
  as = 'div',
  delay = 0,
  className = '',
  children,
  ...rest
}) {
  const ref = React.useRef(null);
  // Visible by default; only hides once the observer confirms the element is off-screen.
  const [inView, setIn] = React.useState(true);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          setIn(true);
          io.disconnect();
        } else setIn(false);
      });
    }, {
      threshold: 0.12
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const T = as;
  return /*#__PURE__*/React.createElement(T, _extends({
    ref: ref,
    className: ('k-reveal ' + className).trim(),
    "data-in": inView ? 'true' : undefined,
    style: {
      transitionDelay: delay + 'ms'
    }
  }, rest), children);
}
function StatusBadge({
  status
}) {
  const {
    Badge
  } = DS;
  if (status === 'wip') return /*#__PURE__*/React.createElement(Badge, {
    dot: true,
    pulse: true
  }, "\u0412 \u0440\u0430\u0431\u043E\u0442\u0435");
  if (status === 'archive') return /*#__PURE__*/React.createElement(Badge, {
    variant: "subtle"
  }, "\u0410\u0440\u0445\u0438\u0432");
  if (status === 'concept') return /*#__PURE__*/React.createElement(Badge, {
    variant: "dashed"
  }, "\u041A\u043E\u043D\u0446\u0435\u043F\u0442");
  return /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, "Production");
}
const NAV = [{
  id: 'home',
  label: 'Индекс'
}, {
  id: 'work',
  label: 'Проекты'
}, {
  id: 'contact',
  label: 'Контакт'
}];
function SiteHeader({
  page,
  go
}) {
  const {
    NavBar,
    PixelLogo,
    ThemeToggle,
    Tooltip
  } = DS;
  const current = page === 'case' ? 'work' : page;
  return /*#__PURE__*/React.createElement(NavBar, {
    brand: /*#__PURE__*/React.createElement("a", {
      className: "sw-nav__brand",
      href: "#home",
      onClick: e => {
        e.preventDefault();
        go('home');
      }
    }, /*#__PURE__*/React.createElement(PixelLogo, {
      size: 30,
      animate: false,
      title: "Sumchenko Works \u2014 \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E"
    }), /*#__PURE__*/React.createElement("span", null, "Sumchenko Works")),
    links: NAV,
    current: current,
    onNavigate: go,
    actions: /*#__PURE__*/React.createElement(Tooltip, {
      content: "\u0421\u043C\u0435\u043D\u0438\u0442\u044C \u0442\u0435\u043C\u0443",
      side: "bottom"
    }, /*#__PURE__*/React.createElement(ThemeToggle, {
      size: "sm"
    }))
  });
}
function SiteFooter({
  go
}) {
  const {
    Coord,
    PixelLogo
  } = DS;
  return /*#__PURE__*/React.createElement("footer", {
    className: "k-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-wrap k-footer__in"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(PixelLogo, {
    size: 56,
    animate: false
  }), /*#__PURE__*/React.createElement("span", {
    className: "sw-label",
    style: {
      letterSpacing: 'var(--track-caps)',
      color: 'var(--fg)'
    }
  }, "Ideas / Systems / Products")), /*#__PURE__*/React.createElement("div", {
    className: "k-footer__links"
  }, /*#__PURE__*/React.createElement("a", {
    className: "sw-label",
    href: "#work",
    onClick: e => {
      e.preventDefault();
      go('work');
    }
  }, "\u041F\u0440\u043E\u0435\u043A\u0442\u044B"), /*#__PURE__*/React.createElement("a", {
    className: "sw-label",
    href: "#contact",
    onClick: e => {
      e.preventDefault();
      go('contact');
    }
  }, "\u041A\u043E\u043D\u0442\u0430\u043A\u0442"), /*#__PURE__*/React.createElement("a", {
    className: "sw-label",
    href: "#",
    onClick: e => e.preventDefault()
  }, "GitHub")), /*#__PURE__*/React.createElement(Coord, null, "\xA9 2026 \xB7 Sumchenko Works")));
}
Object.assign(window, {
  DS,
  Reveal,
  StatusBadge,
  SiteHeader,
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Work.jsx
try { (() => {
function ProjectCard({
  p,
  onOpen
}) {
  const {
    Card,
    Tag,
    IsoDiagram
  } = DS;
  return /*#__PURE__*/React.createElement(Card, {
    className: "k-pcard",
    onClick: onOpen,
    onKeyDown: e => {
      if (e.key === 'Enter') onOpen();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-pcard__art"
  }, /*#__PURE__*/React.createElement(IsoDiagram, {
    nodes: p.nodes,
    links: p.links,
    unit: 16,
    animate: false,
    labels: false,
    style: {
      maxHeight: 148
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, p.code, " \xB7 ", p.year), /*#__PURE__*/React.createElement(StatusBadge, {
    status: p.status
  })), /*#__PURE__*/React.createElement("h3", null, p.title), /*#__PURE__*/React.createElement("p", null, p.summary), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 'auto'
    }
  }, p.stack.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s,
    size: "sm"
  }, s))));
}
function Work({
  openCase
}) {
  const {
    SectionHead,
    Tag,
    Tabs,
    Input,
    Icon
  } = DS;
  const D = window.SW_DATA;
  const [kind, setKind] = React.useState('all');
  const [view, setView] = React.useState('grid');
  const [q, setQ] = React.useState('');
  const kinds = [{
    id: 'all',
    label: 'Все'
  }, {
    id: 'dev',
    label: 'Разработка'
  }, {
    id: 'sa',
    label: 'Системный анализ'
  }, {
    id: 'arch',
    label: 'Проектирование'
  }];
  const list = D.projects.filter(p => (kind === 'all' || p.kind === kind) && (!q || (p.title + ' ' + p.stack.join(' ')).toLowerCase().includes(q.toLowerCase())));
  return /*#__PURE__*/React.createElement("div", {
    className: "k-page k-wrap",
    style: {
      paddingTop: 56,
      paddingBottom: 'var(--space-section)'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    index: "01 / \u0420\u0430\u0431\u043E\u0442\u044B",
    title: "\u041F\u0440\u043E\u0435\u043A\u0442\u044B",
    meta: list.length + ' из ' + D.projects.length
  }), /*#__PURE__*/React.createElement("div", {
    className: "k-toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-filters"
  }, kinds.map(k => /*#__PURE__*/React.createElement(Tag, {
    key: k.id,
    selected: kind === k.id,
    onClick: () => setKind(k.id)
  }, k.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 240
    }
  }, /*#__PURE__*/React.createElement(Input, {
    icon: "search",
    placeholder: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0438\u043B\u0438 \u0441\u0442\u0435\u043A",
    "aria-label": "\u041F\u043E\u0438\u0441\u043A",
    value: q,
    onChange: e => setQ(e.target.value)
  })), /*#__PURE__*/React.createElement(Tabs, {
    variant: "segmented",
    value: view,
    onChange: setView,
    items: [{
      id: 'grid',
      label: 'Сетка'
    }, {
      id: 'list',
      label: 'Список'
    }]
  }))), list.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "k-empty"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, "0 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432 \u2014 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0434\u0440\u0443\u0433\u043E\u0439 \u0437\u0430\u043F\u0440\u043E\u0441")) : view === 'grid' ? /*#__PURE__*/React.createElement("div", {
    className: "k-cards",
    key: 'g' + kind
  }, list.map((p, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: p.id,
    delay: i * 50,
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(ProjectCard, {
    p: p,
    onOpen: () => openCase(p.id)
  })))) : /*#__PURE__*/React.createElement("div", {
    className: "k-rows",
    key: 'l' + kind
  }, list.map(p => /*#__PURE__*/React.createElement("a", {
    key: p.id,
    className: "k-row",
    href: '#' + p.id,
    onClick: e => {
      e.preventDefault();
      openCase(p.id);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-label"
  }, p.code), /*#__PURE__*/React.createElement("span", {
    className: "k-row__title"
  }, p.title), /*#__PURE__*/React.createElement("span", {
    className: "sw-label k-hide-s"
  }, p.stack.join(' · ')), /*#__PURE__*/React.createElement("span", {
    className: "k-hide-s"
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: p.status
  })), /*#__PURE__*/React.createElement("span", {
    className: "k-row__go"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right"
  }))))));
}
Object.assign(window, {
  Work,
  ProjectCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Work.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/data.js
try { (() => {
// Sample content for the UI kit. Projects are PLACEHOLDERS — replace with real work.
window.SW_DATA = {
  email: 'hello@sumchenko.works',
  disciplines: [{
    id: 'dev',
    idx: '01',
    title: 'Разработка',
    text: 'Веб-сервисы, API и внутренние инструменты — от прототипа до продакшена.'
  }, {
    id: 'sa',
    idx: '02',
    title: 'Системный анализ',
    text: 'Требования, процессы, модели данных и контракты интеграций.'
  }, {
    id: 'arch',
    idx: '03',
    title: 'Проектирование',
    text: 'Архитектура программных решений и документация, по которой можно строить.'
  }],
  steps: [{
    idx: '01',
    title: 'Исследование',
    text: 'Контекст, пользователи, ограничения. Что именно должно работать.'
  }, {
    idx: '02',
    title: 'Модель',
    text: 'Границы системы, сущности, сценарии. Схема раньше кода.'
  }, {
    idx: '03',
    title: 'Реализация',
    text: 'Итерации с проверкой гипотез. AI-инструменты там, где они ускоряют.'
  }, {
    idx: '04',
    title: 'Документация',
    text: 'ADR, диаграммы и контракты остаются вместе с продуктом.'
  }],
  artifacts: [{
    code: 'ADR',
    title: 'Architecture Decision Records',
    meta: '7 записей'
  }, {
    code: 'C4',
    title: 'Диаграммы контекста и контейнеров',
    meta: '4 уровня'
  }, {
    code: 'ERD',
    title: 'Модель данных',
    meta: '32 сущности'
  }, {
    code: 'API',
    title: 'OpenAPI-спецификации',
    meta: '3 сервиса'
  }],
  projects: [{
    id: 'p03',
    code: 'P—03',
    title: 'Платёжный шлюз',
    kind: 'sa',
    kindLabel: 'Системный анализ',
    year: 2025,
    status: 'live',
    stack: ['go', 'kafka', 'postgres'],
    summary: 'Единая точка приёма платежей для трёх продуктов: маршрутизация, идемпотентность, сверка.',
    role: 'Системный анализ, архитектура',
    period: '2025.03 — 2025.11',
    nodes: [{
      id: 'client',
      label: 'CLIENTS',
      sub: 'web · mobile · pos',
      x: 0,
      y: 0,
      w: 2,
      d: 2,
      h: 0.5
    }, {
      id: 'gw',
      label: 'GATEWAY',
      sub: 'auth · idempotency',
      x: 4,
      y: 0,
      w: 2,
      d: 2,
      h: 1
    }, {
      id: 'svc',
      label: 'ROUTER',
      sub: '3 × go',
      x: 8,
      y: 0,
      w: 2,
      d: 2,
      h: 2
    }, {
      id: 'queue',
      label: 'EVENTS',
      sub: 'kafka',
      x: 4,
      y: 4,
      w: 2,
      d: 1,
      h: 0.5
    }, {
      id: 'db',
      label: 'LEDGER',
      sub: 'postgres',
      x: 8,
      y: 4,
      w: 2,
      d: 2,
      h: 1.5
    }],
    links: [['client', 'gw'], ['gw', 'svc'], ['gw', 'queue'], ['queue', 'db'], ['svc', 'db']],
    notes: {
      client: 'Три продукта с разными SDK приходят в один контракт.',
      gw: 'Ключ идемпотентности на каждый запрос, лимиты по мерчанту.',
      svc: 'Выбор провайдера по стоимости и доступности.',
      queue: 'Все изменения статусов — события; потребители независимы.',
      db: 'Двойная запись и ежедневная сверка с провайдерами.'
    }
  }, {
    id: 'p04',
    code: 'P—04',
    title: 'AI-ассистент для документации',
    kind: 'dev',
    kindLabel: 'Разработка',
    year: 2026,
    status: 'wip',
    stack: ['python', 'rag', 'llm api'],
    summary: 'Поиск и ответы по внутренней технической документации с указанием источников.',
    nodes: [{
      id: 'docs',
      label: 'DOCS',
      x: 0,
      y: 0,
      w: 2,
      d: 2,
      h: 1
    }, {
      id: 'idx',
      label: 'INDEX',
      x: 4,
      y: 0,
      w: 2,
      d: 2,
      h: 0.5
    }, {
      id: 'llm',
      label: 'LLM',
      x: 4,
      y: 4,
      w: 2,
      d: 2,
      h: 1.5
    }],
    links: [['docs', 'idx'], ['idx', 'llm']]
  }, {
    id: 'p02',
    code: 'P—02',
    title: 'Аналитическое хранилище',
    kind: 'arch',
    kindLabel: 'Проектирование',
    year: 2025,
    status: 'live',
    stack: ['clickhouse', 'airflow', 'dbt'],
    summary: 'Слой данных для отчётности: источники, ETL, витрины и правила качества.',
    nodes: [{
      id: 'src',
      label: 'SOURCES',
      x: 0,
      y: 0,
      w: 2,
      d: 3,
      h: 1
    }, {
      id: 'etl',
      label: 'ETL',
      x: 4,
      y: 1,
      w: 2,
      d: 1,
      h: 0.5
    }, {
      id: 'dwh',
      label: 'DWH',
      x: 8,
      y: 0,
      w: 3,
      d: 3,
      h: 2
    }],
    links: [['src', 'etl'], ['etl', 'dwh']]
  }, {
    id: 'p01',
    code: 'P—01',
    title: 'Сервис бронирования',
    kind: 'dev',
    kindLabel: 'Разработка',
    year: 2026,
    status: 'live',
    stack: ['react', 'node.js', 'postgres'],
    summary: 'Онлайн-запись с расписанием специалистов, напоминаниями и оплатой.',
    nodes: [{
      id: 'web',
      label: 'WEB',
      x: 0,
      y: 0,
      w: 2,
      d: 2,
      h: 0.5
    }, {
      id: 'api',
      label: 'API',
      x: 4,
      y: 0,
      w: 2,
      d: 2,
      h: 1.5
    }, {
      id: 'db',
      label: 'DB',
      x: 4,
      y: 4,
      w: 2,
      d: 2,
      h: 1
    }],
    links: [['web', 'api'], ['api', 'db']]
  }, {
    id: 'p05',
    code: 'P—05',
    title: 'CRM для малого бизнеса',
    kind: 'sa',
    kindLabel: 'Системный анализ',
    year: 2024,
    status: 'archive',
    stack: ['bpmn', 'erd', 'openapi'],
    summary: 'Описание процессов продаж, модель данных и требования к интеграциям.',
    nodes: [{
      id: 'a',
      label: 'LEADS',
      x: 0,
      y: 0,
      w: 2,
      d: 2,
      h: 1
    }, {
      id: 'b',
      label: 'DEALS',
      x: 4,
      y: 0,
      w: 2,
      d: 2,
      h: 1
    }, {
      id: 'c',
      label: 'BILLING',
      x: 8,
      y: 0,
      w: 2,
      d: 2,
      h: 1
    }],
    links: [['a', 'b'], ['b', 'c']]
  }, {
    id: 'p06',
    code: 'P—06',
    title: 'Мониторинг IoT-устройств',
    kind: 'arch',
    kindLabel: 'Проектирование',
    year: 2024,
    status: 'concept',
    stack: ['mqtt', 'timescaledb'],
    summary: 'Сбор телеметрии с датчиков, алерты и панель состояния парка устройств.',
    nodes: [{
      id: 'dev',
      label: 'DEVICES',
      x: 0,
      y: 0,
      w: 3,
      d: 1,
      h: 0.5
    }, {
      id: 'br',
      label: 'BROKER',
      x: 4,
      y: 0,
      w: 2,
      d: 2,
      h: 1
    }, {
      id: 'ts',
      label: 'TSDB',
      x: 4,
      y: 4,
      w: 2,
      d: 2,
      h: 2
    }],
    links: [['dev', 'br'], ['br', 'ts']]
  }],
  docs: [{
    code: 'ADR-007',
    title: 'Идемпотентность платёжных запросов',
    type: 'Markdown',
    size: '6 KB'
  }, {
    code: 'C4-L2',
    title: 'Диаграмма контейнеров',
    type: 'PDF',
    size: '1.2 MB'
  }, {
    code: 'ERD-02',
    title: 'Модель данных реестра',
    type: 'PDF',
    size: '2.4 MB'
  }, {
    code: 'API-01',
    title: 'OpenAPI: payments v1',
    type: 'YAML',
    size: '48 KB'
  }, {
    code: 'SEQ-03',
    title: 'Сценарий возврата',
    type: 'PDF',
    size: '640 KB'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.PixelLogo = __ds_scope.PixelLogo;

__ds_ns.SectionHead = __ds_scope.SectionHead;

__ds_ns.Coord = __ds_scope.Coord;

__ds_ns.ThemeToggle = __ds_scope.ThemeToggle;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.SpecList = __ds_scope.SpecList;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.IsoDiagram = __ds_scope.IsoDiagram;

__ds_ns.PixelField = __ds_scope.PixelField;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
