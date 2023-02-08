<!DOCTYPE html>
<html lang="{function.localeToHTML, userLang, defaultLang}" {{{if languageDirection}}}data-dir="{languageDirection}" style="direction: {languageDirection};"{{{end}}}>
<head>
    <title>{browserTitle}</title>
    {{{each metaTags}}}{function.buildMetaTag}{{{end}}}
    <link rel="stylesheet" type="text/css" href="{relative_path}/assets/client{{{if bootswatchSkin}}}-{bootswatchSkin}{{{end}}}.css?{config.cache-buster}" />
    {{{each linkTags}}}{function.buildLinkTag}{{{end}}}

    <script>
        var config = JSON.parse('{{configJSON}}');
        var app = {
            user: JSON.parse('{{userJSON}}')
        };
    </script>

    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

    <script>
      // This code is included in the header.tpl file because it should be applied to every webpage.
      // It is not code that needs to be changed/extended so it does not need to be refactored into a separate file.

      MathJax = {
        tex: {
          inlineMath: [['$', '$'], 
                      ['\\(', '\\)']]
        },
        svg: {
          fontCache: 'global'
        }
      };

      let [debouncer, skipNext] = [null, false];
      document.getElementById("MathJax-script").addEventListener("load", function () {
        new MutationObserver(() => {
          if (skipNext) return skipNext = false;
          if (debouncer) clearTimeout(debouncer);
          debouncer = setTimeout(() => {
            MathJax.typeset();
            skipNext = true;
            clearTimeout(debouncer);
          }, 300);
        }).observe(document.querySelector("html"), { childList: true, subtree: true });
      });    
    </script>

    {{{if useCustomHTML}}}
    {{customHTML}}
    {{{end}}}
    {{{if useCustomCSS}}}
    <style>{{customCSS}}</style>
    {{{end}}}
</head>

<body class="{bodyClass} skin-{{{if bootswatchSkin}}}{bootswatchSkin}{{{else}}}noskin{{{end}}}">
    <nav id="menu" class="slideout-menu hidden">
        <!-- IMPORT partials/slideout-menu.tpl -->
    </nav>
    <nav id="chats-menu" class="slideout-menu hidden">
        <!-- IMPORT partials/chats-menu.tpl -->
    </nav>

    <main id="panel" class="slideout-panel">
        <nav class="navbar navbar-default navbar-fixed-top header" id="header-menu" component="navbar">
            <div class="container">
                <!-- IMPORT partials/menu.tpl -->
            </div>
        </nav>
        <div class="container" id="content">
        <!-- IMPORT partials/noscript/warning.tpl -->
        <!-- IMPORT partials/noscript/message.tpl -->
