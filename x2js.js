x2js = {
  "parse": function(xml) {
    return this.p(xml, { pos: 0 }, true);
  },

  "fastParse": function(xml) {
    return this.p(xml, { pos: 0 }, false);
  },

  p: function(xml, cursor, convertSingleElementArrays) {
    var symbol;
    var entries = {};
    var isRoot = cursor.pos === 0;

    while (cursor.pos < xml.length) {
      var openTagStart = xml.indexOf('<', cursor.pos);

      if (openTagStart < 0) {
        break;
      }

      symbol = xml.charAt(++openTagStart);

      if (symbol === '/') {
        cursor.pos = xml.indexOf('>', openTagStart) + 1;
        break;
      } else if (symbol === '?') {
        cursor.pos = xml.indexOf('?>', openTagStart) + 2;
        continue;
      }

      var tagNameEnd = openTagStart;

      symbol = xml.charAt(tagNameEnd);

      while ( symbol >= 'a' && symbol <= 'z' ||
              symbol >= 'A' && symbol <= 'Z' ||
              symbol >= '0' && symbol <= '9' ||
              '_-'.indexOf(symbol) >= 0) {
        symbol = xml.charAt(++tagNameEnd);
      }

      var tagName = xml.substring(openTagStart, tagNameEnd);
      var dataStart = xml.indexOf('>', tagNameEnd) + 1;

      symbol = xml.charAt(dataStart);

      while (' \n\r\t'.indexOf(symbol) >= 0) {
        symbol = xml.charAt(++dataStart);
      }
      
      var entry;

      if (xml.charAt(dataStart) === '<') {
        if (xml.charAt(dataStart + 1) === '/') {
          cursor.pos = xml.indexOf('>', dataStart) + 1;

          entry = undefined;
        } else {
          cursor.pos = dataStart;

          entry = this.p(xml, cursor, convertSingleElementArrays);
        }
      } else {
        var closeTagStart = xml.indexOf('</', dataStart);

        cursor.pos = xml.indexOf('>', closeTagStart) + 1;

        entry = xml.substring(dataStart, closeTagStart);
      }

      if (isRoot) {
        entries = entry;
      } else {
        entries[tagName] = entries[tagName] || [];
        entries[tagName].push(entry);
      }
    }

    if (convertSingleElementArrays) {
      for (var tagName in entries) {
        var entry = entries[tagName];

        if (Object.prototype.toString.call(entry) === '[object Array]' && entry.length === 1) {
          entries[tagName] = entry[0];
        }
      }
    }

    return entries;
  }
};