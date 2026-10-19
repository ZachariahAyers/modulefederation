declare module "*.module.css" {
  const classes: { readonly [className: string]: string };
  export = classes;
}

declare module "*.css";
