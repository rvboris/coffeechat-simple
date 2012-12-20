this["HBS"] = this["HBS"] || {};

this["HBS"]["src/handlebars/invite.hbs"] = function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"input-append\">\r\n	<input id=\"share-link\" class=\"span3\" type=\"text\" disabled=\"disabled\" value=\"";
  foundHelper = helpers.link;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.link; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\"/>\r\n	<span class=\"add-on\">\r\n		<i class=\"icon-share-alt\"></i>\r\n	</span>\r\n</div>\r\n<span class=\"help-block\">Копировать в буфер обмена: Ctrl + C</span>";
  return buffer;};