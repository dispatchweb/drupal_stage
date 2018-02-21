<?php



namespace Drupal\gacc_settings\Form;



use Drupal\Core\Form\ConfigFormBase;

use Symfony\Component\HttpFoundation\Request;

use Drupal\Core\Form\FormStateInterface;



use Drupal\Core\Extension\ThemeHandlerInterface;

use Drupal\file\Entity;



/**

 * Defines a form that configures forms module settings.

 */

class ModuleConfigurationForm extends ConfigFormBase {



  /**

   * {@inheritdoc}

   */

  public function getFormId() {

    return 'gacc_settings_admin_settings';

  }



  /**

   * {@inheritdoc}

   */

  protected function getEditableConfigNames() {

    return [

      'gacc_settings.settings',

    ];

  }



  /**

   * {@inheritdoc}

   */

  public function buildForm(array $form, FormStateInterface $form_state, Request $request = NULL) {

    $config = $this->config('gacc_settings.settings');

    $form['gacc_code'] = array(

      '#type' => 'textfield',

      '#title' => $this->t('GACC Abbreviation Code'),

      '#default_value' => $config->get('gacc_code'),

      '#description'   => t('Provide the 4 letter abbreviation for this install. example: nicc'),

    );



    $form['gacc_parent'] = array(

      '#type' => 'textfield',

      '#title' => $this->t('Parent GACC'),

      '#default_value' => $config->get('gacc_parent'),

    );

    

    $form['gacc_twitter'] = array(

      '#type' => 'textfield',

      '#title' => $this->t('Twitter Username'),

      '#default_value' => $config->get('gacc_twitter'),

    );

    

    $bgImg = $config->get('gacc_background');

    $form['background'] = [

      '#type' => 'details',

      '#title' => t('Background image'),

      '#open' => TRUE,

    ];

    $form['background']['gacc_background'] = [

      '#type'          => 'managed_file',

      '#title' => t('Upload background image'),

      '#maxlength' => 40,

      '#default_value' => $bgImg,

      '#description' => t("Upload your custom background image for the site."),

      '#upload_validators'  => array(

        'file_validate_extensions' => array('jpg jpeg'),

        'file_validate_size' => array(25600000),

        'file_validate_image_resolution' => array('2800x1400','1800x1256')

      ),

        

    ];





    return parent::buildForm($form, $form_state);

  }



  /**

   * {@inheritdoc}

   */

  public function submitForm(array &$form, FormStateInterface $form_state) {

    $values = $form_state->getValues();

    $this->config('gacc_settings.settings')

      ->set('gacc_parent', $values['gacc_parent'])

      ->set('gacc_code', $values['gacc_code'])

      ->set('gacc_twitter', $values['gacc_twitter'])

      ->save();

    

    //prepare the background img file

    $backgroundimage = $values['gacc_background'];

    

    // Load the object of the file by its fid. 

    $file = \Drupal\file\Entity\File::load($backgroundimage[0]);

    // Set the status flag permanent of the file object.

    if (!empty($file)) {

      //$file->setPermanent();

      $path = 'public://gacc_background';

      // Save the file in the database.

      //$file->save();

      $file_usage = \Drupal::service('file.usage'); 

      $file_usage->add($file, 'gacc_background', 'file', \Drupal::currentUser()->id());

      //move file to background dir and create it if we need to

      if (file_prepare_directory($path, FILE_CREATE_DIRECTORY)) {

        file_move($file,$path,'FILE_EXISTS_REPLACE');

        $this->config('gacc_settings.settings')

              ->set('gacc_background',$values['gacc_background'])

              ->save();

      }//end prepare dir check

    }//end empty check

    else{

        $fid = $this->config('gacc_settings.settings')

              ->get('gacc_background');

        $file = \Drupal\file\Entity\File::load($fid);

        //remove the file usage and the file since its been removed

        if($file) $file_usage->delete($file, 'gacc_background', 'file', \Drupal::currentUser()->id());

        $this->config('gacc_settings.settings')

              ->set('gacc_background',$values['gacc_background'])

              ->save();

    }

  }//end submit





}
