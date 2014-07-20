<?php

/**
 * Register all settings needed for the Settings API.
 *
 * @package    WCRP
 * @subpackage Includes
 * @author     Phil Derksen <pderksen@gmail.com>, Nick Young <mycorpweb@gmail.com>
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * Registers all of the plugin settings
 * 
 * @since 1.0.0
 */
function wcrp_register_settings() {
	$wcrp_settings = array(
		/* General Settings */
		'general' => array(
			'wcrp_license_key' => array(
				'id'   => 'wcrp_license_key',
				'name' => __( 'License Key', 'wcrp' ),
				'desc' => __( 'Enter your license key here to receive automatic updates and support.', 'wcrp' ),
				'type' => 'license',
				'std'  => ''
			),
			'og_site_name' => array(
				'id'       => 'og_site_name',
				'name'     => __( 'Open Graph Site Name', 'wcrp' ),
				'desc'     => __( 'A site-wide Open Graph tag (<code>og:site_name</code>) is recommended by Pinterest since <a href="http://www.schema.org" target="_blank">Schema.org</a> doesn\'t support a site name field. ', 'wcrp' ) .
					__( 'If another plugin is already generating this tag (such as WordPress SEO), you can clear out this value to prevent duplicate output.', 'wcrp' ),
				'type'     => 'text',
				'size'     => 'regular-text'
			),
			'uninstall_save_settings' => array(
				'id' => 'uninstall_save_settings',
				'name' => __( 'Save Settings', 'wcrp' ),
				'desc' => __( 'Save your settings when uninstalling this plugin. Useful when upgrading or re-installing.', 'wcrp' ),
				'type' => 'checkbox'
			)
		)
	);

	/* If the options do not exist then create them for each section */
	if ( false == get_option( 'wcrp_settings_general' ) ) {
		add_option( 'wcrp_settings_general' );
	}

	/* Add the General Settings section */
	add_settings_section(
		'wcrp_settings_general',
		__( 'General Settings', 'wcrp' ),
		'__return_false',
		'wcrp_settings_general'
	);
	
	foreach ( $wcrp_settings['general'] as $option ) {
		add_settings_field(
			'wcrp_settings_general[' . $option['id'] . ']',
			$option['name'],
			function_exists( 'wcrp_' . $option['type'] . '_callback' ) ? 'wcrp_' . $option['type'] . '_callback' : 'wcrp_missing_callback',
			'wcrp_settings_general',
			'wcrp_settings_general',
			wcrp_get_settings_field_args( $option, 'general' )
		);
	}

	/* Register all settings or we will get an error when trying to save */
	register_setting( 'wcrp_settings_general',         'wcrp_settings_general',         'wcrp_settings_sanitize' );
}
add_action( 'admin_init', 'wcrp_register_settings' );

/*
 * Return generic add_settings_field $args parameter array.
 *
 * @since     2.0.0
 *
 * @param   string  $option   Single settings option key.
 * @param   string  $section  Section of settings apge.
 * @return  array             $args parameter to use with add_settings_field call.
 */
function wcrp_get_settings_field_args( $option, $section ) {
	$settings_args = array(
		'id'      => $option['id'],
		'desc'    => $option['desc'],
		'name'    => $option['name'],
		'section' => $section,
		'size'    => isset( $option['size'] ) ? $option['size'] : null,
		'options' => isset( $option['options'] ) ? $option['options'] : '',
		'std'     => isset( $option['std'] ) ? $option['std'] : ''
	);

	// Link label to input using 'label_for' argument if text, textarea, password, select, or variations of.
	// Just add to existing settings args array if needed.
	if ( in_array( $option['type'], array( 'text', 'select', 'textarea', 'password', 'number' ) ) ) {
		$settings_args = array_merge( $settings_args, array( 'label_for' => 'wcrp_settings_' . $section . '[' . $option['id'] . ']' ) );
	}

	return $settings_args;
}

/*
 * License callback function
 * 
 * @since 1.0.0
 */
function wcrp_license_callback( $args ) {
	global $wcrp_options;

	if ( isset( $wcrp_options[ $args['id'] ] ) )
		$value = $wcrp_options[ $args['id'] ];
	else
		$value = isset( $args['std'] ) ? $args['std'] : '';

	$html = "\n" . '<input type="password" class="regular-text" id="wcrp_settings_' . $args['section'] . '[' . $args['id'] . ']" name="wcrp_settings_' . $args['section'] . '[' . $args['id'] . ']" value="' . esc_attr( $value ) . '"/>' . "\n";
	
	// check validation of license entered
	if( ! empty( $wcrp_options[ $args['id'] ] ) ) {
		// Do checks here if license is valid or invalid
		$license = $wcrp_options[ $args['id'] ];
		
		$license_response = wcrp_is_license_valid( $license );
		
		$license_message = 'License invalid';
		
		if( 'valid' == $license_response ) {
			$valid = 'valid';
			$license_message = 'License valid';
		} else if( 'inactive' == $license_response || 'site_inactive' == $license_response ) {
			
			// Activate the license
			$activate = wcrp_activate_license( $license );

			if( 'valid' == $activate ) {
				$valid = 'valid';
				$license_message = 'License valid';
			} else { 
				$error = $activate;
				$valid = 'invalid';
			}
		} else if( 'expired' == $license_response ) {
			// Needs to be renewed or license key is invalid
			//$error = "ERR#003 - License Key is Expired.";
			$valid = 'invalid';
		} else {
			$error = 'An error has occured. <br />' . $license_response;
			$valid = 'invalid';
		}
		
		// Show an icon here if key is valid or invalid
		$html .= '<span id="wcrp-license-validation-icon" class="wcrp-license-' . $valid . '" title="License key ' . $valid . '">' . $license_message . '</span>';
	}
	
	
	
	if( ! empty( $error ) ) {
		$html .= '<p class="wcrp-error">' . $error . '</p>';
	}
	
	// Render and style description text underneath if it exists.
	if ( ! empty( $args['desc'] ) )
		$html .= '<p class="description">' . $args['desc'] . '</p>' . "\n";

	echo $html;
}

/*
 * Radio button callback function
 * 
 * @since 1.0.0
 */
function wcrp_radio_callback( $args ) {
	global $wcrp_options;

	// Return empty string if no options.
	if ( empty( $args['options'] ) ) {
		echo '';
		return;
	}

	$html = "\n";

	foreach ( $args['options'] as $key => $option ) {
		$checked = false;

		if ( isset( $wcrp_options[ $args['id'] ] ) && $wcrp_options[ $args['id'] ] == $key )
			$checked = true;
		elseif ( isset( $args['std'] ) && $args['std'] == $key && ! isset( $wcrp_options[ $args['id'] ] ) )
			$checked = true;

		$html .= '<input name="wcrp_settings_' . $args['section'] . '[' . $args['id'] . ']" id="wcrp_settings_' . $args['section'] . '[' . $args['id'] . '][' . $key . ']" type="radio" value="' . $key . '" ' . checked( true, $checked, false ) . '/>' . "\n";
		$html .= '<label for="wcrp_settings_' . $args['section'] . '[' . $args['id'] . '][' . $key . ']">' . $option . '</label><br/>' . "\n";
	}

	// Render and style description text underneath if it exists.
	if ( ! empty( $args['desc'] ) )
		$html .= '<p class="description">' . $args['desc'] . '</p>' . "\n";

	echo $html;
}

/*
 * Single checkbox callback function
 * 
 * @since 1.0.0
 */
function wcrp_checkbox_callback( $args ) {
	global $wcrp_options;
	
	$checked = isset( $wcrp_options[$args['id']] ) ? checked( 1, $wcrp_options[$args['id']], false ) : '';
	$html = "\n" . '<input type="checkbox" id="wcrp_settings_' . $args['section'] . '[' . $args['id'] . ']" name="wcrp_settings_' . $args['section'] . '[' . $args['id'] . ']" value="1" ' . $checked . '/>' . "\n";

	// Render description text directly to the right in a label if it exists.
	if ( ! empty( $args['desc'] ) )
		$html .= '<label for="wcrp_settings_' . $args['section'] . '[' . $args['id'] . ']"> '  . $args['desc'] . '</label>' . "\n";

	echo $html;
}

/*
 * Multiple checkboxes callback function
 * 
 * @since 1.0.0
 */
function wcrp_multicheck_callback( $args ) {
	global $wcrp_options;

	// Return empty string if no options.
	if ( empty( $args['options'] ) ) {
		echo '';
		return;
	}

	$html = "\n";

	foreach ( $args['options'] as $key => $option ) {
		if ( isset( $wcrp_options[$args['id']][$key] ) ) { $enabled = $option; } else { $enabled = NULL; }
		$html .= '<input name="wcrp_settings_' . $args['section'] . '[' . $args['id'] . '][' . $key . ']" id="wcrp_settings_' . $args['section'] . '[' . $args['id'] . '][' . $key . ']" type="checkbox" value="' . $option . '" ' . checked($option, $enabled, false) . '/>' . "\n";
		$html .= '<label for="wcrp_settings_' . $args['section'] . '[' . $args['id'] . '][' . $key . ']">' . $option . '</label><br/>' . "\n";
	}

	// Render and style description text underneath if it exists.
	if ( ! empty( $args['desc'] ) )
		$html .= '<p class="description">' . $args['desc'] . '</p>' . "\n";

	echo $html;
}

/*
 * Select box callback function
 * 
 * @since 1.0.0
 */
function wcrp_select_callback( $args ) {
	global $wcrp_options;

	// Return empty string if no options.
	if ( empty( $args['options'] ) ) {
		echo '';
		return;
	}

	$html = "\n" . '<select id="wcrp_settings_' . $args['section'] . '[' . $args['id'] . ']" name="wcrp_settings_' . $args['section'] . '[' . $args['id'] . ']"/>' . "\n";

	foreach ( $args['options'] as $option => $name ) :
		$selected = isset( $wcrp_options[$args['id']] ) ? selected( $option, $wcrp_options[$args['id']], false ) : '';
		$html .= '<option value="' . $option . '" ' . $selected . '>' . $name . '</option>' . "\n";
	endforeach;

	$html .= '</select>' . "\n";

	// Render and style description text underneath if it exists.
	if ( ! empty( $args['desc'] ) )
		$html .= '<p class="description">' . $args['desc'] . '</p>' . "\n";

	echo $html;
}

/*
 * Textarea callback function
 * 
 * @since 1.0.0
 */
function wcrp_textarea_callback( $args ) {
	global $wcrp_options;

	if ( isset( $wcrp_options[ $args['id'] ] ) )
		$value = $wcrp_options[ $args['id'] ];
	else
		$value = isset( $args['std'] ) ? $args['std'] : '';

	// Ignoring size at the moment.
	$html = "\n" . '<textarea class="large-text" cols="50" rows="10" id="wcrp_settings_' . $args['section'] . '[' . $args['id'] . ']" name="wcrp_settings_' . $args['section'] . '[' . $args['id'] . ']">' . esc_textarea( $value ) . '</textarea>' . "\n";

	// Render and style description text underneath if it exists.
	if ( ! empty( $args['desc'] ) )
		$html .= '<p class="description">' . $args['desc'] . '</p>' . "\n";

	echo $html;
}

/**
 * Number callback function
 * 
 * @since 1.0.0
 */
function wcrp_number_callback( $args ) {
	global $wcrp_options;

	if ( isset( $wcrp_options[ $args['id'] ] ) )
		$value = $wcrp_options[ $args['id'] ];
	else
		$value = isset( $args['std'] ) ? $args['std'] : '';

	$size = ( isset( $args['size'] ) && ! is_null( $args['size'] ) ) ? $args['size'] : 'regular';
	$html = "\n" . '<input type="number" class="' . $size . '-text" id="wcrp_settings_' . $args['section'] . '[' . $args['id'] . ']" name="wcrp_settings_' . $args['section'] . '[' . $args['id'] . ']" step="1" value="' . esc_attr( $value ) . '"/>' . "\n";

	// Render description text directly to the right in a label if it exists.
	if ( ! empty( $args['desc'] ) )
		$html .= '<label for="wcrp_settings_' . $args['section'] . '[' . $args['id'] . ']"> '  . $args['desc'] . '</label>' . "\n";

	echo $html;
}

/**
 * Textbox callback function
 * Valid built-in size CSS class values:
 * small-text, regular-text, large-text
 * 
 * @since 1.0.0
 */
function wcrp_text_callback( $args ) {
	global $wcrp_options;

	if ( isset( $wcrp_options[ $args['id'] ] ) )
		$value = $wcrp_options[ $args['id'] ];
	else
		$value = isset( $args['std'] ) ? $args['std'] : '';

	$size = ( isset( $args['size'] ) && ! is_null( $args['size'] ) ) ? $args['size'] : '';
	$html = "\n" . '<input type="text" class="' . $size . '" id="wcrp_settings_' . $args['section'] . '[' . $args['id'] . ']" name="wcrp_settings_' . $args['section'] . '[' . $args['id'] . ']" value="' . esc_attr( $value ) . '"/>' . "\n";

	// Render and style description text underneath if it exists.
	if ( ! empty( $args['desc'] ) )
		$html .= '<p class="description">' . $args['desc'] . '</p>' . "\n";

	echo $html;
}

/*
 * Function we can use to sanitize the input data and return it when saving options
 * 
 * @since 1.0.0
 */
function wcrp_settings_sanitize( $input ) {
	add_settings_error( 'wcrp-notices', '', '', '' );
	return $input;
}

/*
 * Default callback function if correct one does not exist
 * 
 * @since 1.0.0
 */
function wcrp_missing_callback( $args ) {
	printf( __( 'The callback function used for the <strong>%s</strong> setting is missing.', 'wcrp' ), $args['id'] );
}

/*
 * Function used to return an array of all of the plugin settings
 * 
 * @since 1.0.0
 */
function wcrp_get_settings() {
	
	// Setup our defaults and tell the plugin it has already ran so we don't override options later
	
	if( ! get_option( 'wcrp_settings_loaded' ) ) {
		
		// Default save settings option to on
		$general = get_option( 'wcrp_settings_general' );
		$general['uninstall_save_settings'] = 1;
		$general['og_site_name'] = get_bloginfo( 'title' );
		update_option( 'wcrp_settings_general', $general );
		
		add_option( 'wcrp_settings_loaded', 1 );
	}

	$general_settings         = is_array( get_option( 'wcrp_settings_general' ) ) ? get_option( 'wcrp_settings_general' )  : array();

	return array_merge( $general_settings );
}

