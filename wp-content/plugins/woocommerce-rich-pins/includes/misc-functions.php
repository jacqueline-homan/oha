<?php

/**
 * Misc functions to use throughout the plugin.
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
 * Function to check if WooCommerce is activated
 * 
 * @since 1.0.0
 */
function wcrp_is_woocommerce_active() {
	return class_exists( 'WooCommerce' );
}

/*
 * Function to check if a certain post type exists
 * 
 * @since 1.0.0
 */
function wcrp_is_post_type( $post_type ) {
	return post_type_exists( $post_type );
}

/**
 * Check if the EDD license key is valid
 *
 * @since   1.0.0
 *
 * @return  string
 */
function wcrp_is_license_valid( $license ) {
	$check_params = array( 
		'edd_action'=> 'check_license',
		'license' 	=> $license, 
		'item_name' => urlencode( WCRP_EDD_SL_ITEM_NAME )
	);

	// Call the custom API.
	$response = wp_remote_get( add_query_arg( $check_params, WCRP_EDD_SL_STORE_URL ), array( 'timeout' => 15, 'sslverify' => false ) );
	
	// make sure the response came back okay
	if ( is_wp_error( $response ) ) {
		return 'ERR#001 - Validation Check Error ( ' . $response->get_error_message() . ' )';
	}
	
	// decode the license data
	$license_data = json_decode( wp_remote_retrieve_body( $response ) );
	
	return $license_data->license;
}

/**
 * Activate EDD license
 *
 * @since   1.0.0
 *
 * @return  string
 */
function wcrp_activate_license( $license ) {
	// Do activation
	$activate_params = array(
		'edd_action' => 'activate_license',
		'license'    => $license,
		'item_name'  => urlencode( WCRP_EDD_SL_ITEM_NAME ),
		'url' => home_url()
	);

	$response = wp_remote_get( add_query_arg( $activate_params, WCRP_EDD_SL_STORE_URL ), array( 'timeout' => 15, 'sslverify' => false ) );

	if( is_wp_error( $response ) )
	{
		return 'ERR#002 - Error Activating License ( ' . $response->get_error_message() . ' )';
	}

	$activate_data = json_decode( wp_remote_retrieve_body( $response ) );

	return $activate_data->license;
}

/**
 * Get domain name without "http" & "www". Leave subdomain if no "www". Usually pass in home_url().
 * Purpose is to link to http://www.pinterest.com/source/[domain.com]/
 *
 * @since   1.0.1
 *
 * @return  string
 */
function wcrp_get_base_domain_name( $url ) {
	//First strip http(s)://
	$url = parse_url( $url, PHP_URL_HOST );
	$url = preg_replace( '#^www\.(.+\.)#i', '$1', $url );

	return $url;
}
