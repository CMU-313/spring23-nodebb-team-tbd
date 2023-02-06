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

  
    <script>
      function changeHTML() {
        // toggle background color to mimic latex typset effect
        // this is because changing the html could potentially cause the observer to go
        // into an infinite loop
        if (document.querySelector("body").style.backgroundColor === "red")
          document.querySelector("body").style.backgroundColor = "white";
        else
          document.querySelector("body").style.backgroundColor = "red";
        document.querySelector("head").innerHTML += "<div></div>";
      }

      let debouncer = null;
      let skipNext = false;
      const observer = new MutationObserver(function (mutations) {
        if (skipNext) return console.log("SKIPPING!", (skipNext = false)?"":"");
        if (debouncer) clearTimeout(debouncer);
        debouncer = setTimeout(() => {
          console.log("FIRE!")
          changeHTML();
          skipNext = true;
          clearTimeout(debouncer);
        }, 100);
      });
      observer.observe(document.querySelector("html"), { childList: true, subtree: true });
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
