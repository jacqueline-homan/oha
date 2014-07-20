<?php

/**
 *  Admin settings page update notices.
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
 * Display save settings message in admin
 * 
 * @since 1.0.0
 */
function wcrp_register_admin_notices() { 
	
	if ( ( isset( $_GET['page'] ) && 'woocommerce-rich-pins' == $_GET['page'] ) && ( isset( $_GET['settings-updated'] ) && 'true' == $_GET['settings-updated'] ) ) {
		add_settings_error( 'wcrp-notices', 'wcrp-general-updated', __( 'Settings updated.', 'wcrp' ), 'updated' );
	}
	
	settings_errors( 'wcrp-notices' );
}
add_action( 'admin_notices', 'wcrp_register_admin_notices' );
