// Global theme registry - each theme JS file registers itself here
window.themeRegistry = window.themeRegistry || {};

window.registerTheme = function(name, cssText) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(cssText);
  window.themeRegistry[name] = sheet;
};

window.getThemeSheet = function(name) {
  return window.themeRegistry[name] || window.themeRegistry.downtown;
};
