---
---
<!DOCTYPE html>
<html>

  <head>
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta name="description" content="Rodan Client : A client for Rodan. Dig it.">
    <link rel="stylesheet" type="text/css" media="screen" href="http://ddmal.github.io/rodan-client/stylesheets/stylesheet.css">
    <title>Rodan Client</title>
  </head>

  <body>

    {% include header.html %}

    <!-- MAIN CONTENT -->
    <div id="main_content_wrap" class="outer">
      <section id="main_content" class="inner">
          {{page.content}}
      </section>
    </div>

    {% include footer.html %}

  </body>
</html>
