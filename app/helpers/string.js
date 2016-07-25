(function () {
  /**
  * HTML escaping.
  **/
  String.prototype.escape = function() {
    var tagsToReplace = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    };
    return this.replace(/[&<>]/g, function(tag) {
      return tagsToReplace[tag] || tag;
    });
  };

  /**
  * Newline (\r\n) to <br> or <br/> if xhtml.
  **/
  String.prototype.nl2br = function (is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>';
    return this.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  };
})();
