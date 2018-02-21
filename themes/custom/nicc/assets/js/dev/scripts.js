/**
 * @file
 * NICC Base theme Javascript file.
 */
(function ($, Drupal) {
  'use strict';

$('.field--name-field-card-image-link a').each(function(){
  var a_href = $(this).attr('href');
  $(this).parent().prev().wrap( "<a href='" + a_href + "' /></a>" );
  //console.log(a_href);
});

$('.field--name-field-card-image.field--type-image').addClass(function(){
  return ["none", "one", "two"]
     [$(this).children('.field__item').length];
});

$('.field__item .field__items').collapseList({
  'collapseNum' : 9,
  'moreLinkText' : 'view more',
  'lessLinkText' : 'view less'
});

$('.eck--card article.media--type-file').each(function(){
  var MediaFileName = $(this).find('.field--name-name.field__item').text();
  $(this).find('.field--name-field-media-file.field__item > span.file > a').text(MediaFileName);
  $(this).find('.field--name-field-media-file.field__item > span.file > a').attr('target', '_blank');
});

})(jQuery, Drupal);