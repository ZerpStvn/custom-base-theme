<?php
class CbthemeThemeHooksFilters {

  public static function init() {
    add_filter('acf/fields/wysiwyg/toolbars', [(new self), 'custom_toolbars']);
    add_filter('tiny_mce_before_init', [(new self), 'customize_tinymce_formats']);
  }

  function custom_toolbars($toolbars)
  {
      $toolbars['Plain Heading'] = array();
      $toolbars['Plain Heading'][1] = array('fullscreen', 'bold');

      $toolbars['Regular'] = array();
      $toolbars['Regular'][1] = array('fullscreen', 'italic', 'bold', 'bullist', 'link');

      return $toolbars;
  }
  
  function customize_tinymce_formats($init)
  {
      $init['block_formats'] = 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6;';
      return $init;
  }
}
CbthemeThemeHooksFilters::init();
