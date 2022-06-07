## 🚨 Disclaimer - Template Application
>:warning: **This project is not maintained by VTEX, and this app is provided as a working example on how this feature can be implemented. Improvements and fixes will be on the implementation team side.**
>
>All template applications provided are developed by the VTEX community, you can use them freely.

&nbsp;
# Rewriter Page Draft
This app blocks any request made to `/_draft/` folder from public access. The app is a template for building applications that block public access to specific routes, while mantaining all these routes accesible from myvtex.com domain.

&nbsp;
# Usage
For testing it you can install the app via VTEX Toolbelt. 

```bash
    vtex install vtex.rewriter-pages-draft@0.x
```

## How it works?
After installing the app, all request to URLs starting with `/_draft/` will return a 404 error if navigated from the public domain. These routes will still be available from the yvtex.com domain.

From a CMS perspective, this feature allows the user to create draft pages and work on them, while not making them public. Creating a page with a URL starting with `/_draft/` will make the trick. The page content will be available from the site editor in order to work on it, and a preview can be navigated using the myvtex domain.

Once the content is finished, the page can be **published** just removing the `/_draft/` segment from the page URL.

## Possible Uses
This app can be used for blocking any public access while mainting the autenticated access using myvtex.com domain. Also can be used to restric access based on other conditions. Basically, this app allows to rewrite the request internally based on specific conditions.


<!-- DOCS-IGNORE:start -->

&nbsp;
# Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

<!-- DOCS-IGNORE:end -->
