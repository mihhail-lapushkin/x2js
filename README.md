# Lightning fast XML to JSON parser for JavaScript!
##### Based on [xml2json](http://www.diegoruega.com/?module=blog&page=viewpost&post=have-ever-had-needs-to-convert-an-xml-response-to-json.php) By Diego Ruega

A tiny XML parser that I've once written for my needs. It parses only the content of nodes and does not work with:
* Short empty tags such as `<tag/>`
* Comments
* Other crazy stuff like CDATA

Has two methods:

* #### `x2js.parse(xml)`<br>
  A slower version of parsing, since it collapses 1-element arrays.<br><br>
  For example, this input:
  
      <root>
        <header>items</header>
        <item>1</item>
        <item>2</item>
        <item>3</item>
        <item>4</item>
      </root>
  
  Translates to:
  
      {
        header: "items",
        item: [ "1", "2", "3", "4" ]
      }
    

* #### `x2js.fastParse(xml)`<br>
  About 20% faster than previous method.<br><br>
  For example, this input:
  
      <root>
        <header>items</header>
        <item>1</item>
        <item>2</item>
        <item>3</item>
        <item>4</item>
      </root>
  
  Translates to:
  
      {
        header: [ "items" ],
        item: [ "1", "2", "3", "4" ]
      }