<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @package WCRP
 * @author  Phil Derksen <pderksen@gmail.com>, Nick Young <mycorpweb@gmail.com>
 */

// If uninstall, not called from WordPress, then exit
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

$general = get_option( 'wcrp_settings_general' );

// If the the option to save settings is checked then do nothing, otherwise delete all options and post meta
if ( ! empty( $general['uninstall_save_settings'] ) ) {
	// Do nothing
} else {
	
	// Delete options
	delete_option( 'wcrp_settings_loaded' );
	delete_option( 'wcrp_settings_general' );
	delete_option( 'wcrp_show_admin_install_notice' );
	
	// Delete post meta
	delete_post_meta_by_key( 'wcrp_brand_name' );
	delete_post_meta_by_key( 'wcrp_product_id' );
}
