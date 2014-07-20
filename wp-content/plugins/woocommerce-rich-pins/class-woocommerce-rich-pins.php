<?php
/**
 * Main WooCommerce Rich Pins class
 *
 * @package WCRP
 * @author  Phil Derksen <pderksen@gmail.com>, Nick Young <mycorpweb@gmail.com>
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WooCommerce_Rich_Pins {

	/**
	 * Plugin version, used for cache-busting of style and script file references.
	 *
	 * @since   1.0.0
	 *
	 * @var     string
	 */

	/**************************************
	 * UPDATE VERSION HERE
	 * and main plugin file header comments
	 * and README.txt changelog
	 **************************************/

	const VERSION = '1.0.2';

	/**
	 * Unique identifier for your plugin.
	 *
	 * Use this value (not the variable name) as the text domain when internationalizing strings of text. It should
	 * match the Text Domain file header in the main plugin file.
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $plugin_slug = 'woocommerce-rich-pins';

	/**
	 * Instance of this class.
	 *
	 * @since    1.0.0
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Slug of the plugin screen.
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $plugin_screen_hook_suffix = null;
	
	/**
	 * Store URL for EDD SL Updater
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $wcrp_edd_sl_store_url = 'http://pinplugins.com';
	
	
	/**
	 * Product Name for EDD SL Updater
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $wcrp_edd_sl_item_name = 'WooCommerce Rich Pins';
	
	/**
	 * Author Name for EDD SL Updater
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $wcrp_edd_sl_author = 'Phil Derksen';

	/**
	 * Initialize the plugin by setting localization, filters, and administration functions.
	 *
	 * @since     1.0.0
	 */
	private function __construct() {
		
		// Load includes
		add_action( 'init', array( $this, 'includes' ), 1 );
		
		// Load plugin text domain
		add_action( 'init', array( $this, 'load_plugin_textdomain' ) );

		// Add the options page and menu item.
		add_action( 'admin_menu', array( $this, 'add_plugin_admin_menu' ) );

		// Add plugin listing "Settings" action link.
		add_filter( 'plugin_action_links_' . plugin_basename( plugin_dir_path( __FILE__ ) . $this->plugin_slug . '.php' ), array( $this, 'settings_link' ) );
		
		// Call admin notice to check if WooCommerce is active
		add_action( 'admin_notices', array( $this, 'wc_inactive_notice' ) );
		
		// Calls for Post Meta stuff
		add_action( 'add_meta_boxes', array( $this, 'display_post_meta') );
		add_action( 'save_post', array( $this, 'save_meta_data') );
		
		// Add admin notice after plugin activation. Also check if should be hidden.
		add_action( 'admin_notices', array( $this, 'admin_install_notice' ) );
		
		// Add admin CSS
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_styles' ) );
		
		// Run EDD software licensing plugin updater.
		add_action( 'admin_init', array( $this, 'wcrp_edd_sl_updater' ) );
		
		// Check WP version
		add_action( 'admin_init', array( $this, 'check_wp_version' ) );
		
		$this->setup_constants();

	}
	
	/**
	 * Make sure user has the minimum required version of WordPress installed to use the plugin
	 * 
	 * @since 1.0.0
	 */
	public function check_wp_version() {
		global $wp_version;
		$required_wp_version = '3.5.2';
		
		if ( version_compare( $wp_version, $required_wp_version, '<' ) ) {
			deactivate_plugins( WCRP_MAIN_FILE ); 
			wp_die( sprintf( __( $this->get_plugin_title() . ' requires WordPress version <strong>' . $required_wp_version . '</strong> to run properly. ' .
				'Please update WordPress before reactivating this plugin. <a href="%s">Return to Plugins</a>.', 'wcrp' ), get_admin_url( '', 'plugins.php' ) ) );
		}
	}
	
	/**
	 * Includes necessary files
	 *
	 * @since     1.0.0
	 *
	 */
	public function includes() {
		// Load a global variable for options
		global $wcrp_options;
		
		// INclude our settings fields code
		include_once( 'includes/register-settings.php' );
		
		// Set our global options variable
		$wcrp_options = wcrp_get_settings();
		
		
		if( is_admin() ) {
			// Admin includes
			include_once( 'includes/misc-functions.php' );
			include_once( 'includes/admin-notices.php' );
		} else {
			// public includes
			include_once( 'views/public.php' );
		}
	}
	
	/*
	 * Setup any constants needed throughout the plugin
	 * 
	 * @since 1.0.0
	 */
	public function setup_constants() {
		define( 'WCRP_EDD_SL_STORE_URL', $this->wcrp_edd_sl_store_url );
		
		define( 'WCRP_EDD_SL_ITEM_NAME', $this->wcrp_edd_sl_item_name );
		
		if( ! defined( 'PINPLUGIN_BASE_URL' ) ) {
			define( 'PINPLUGIN_BASE_URL', 'http://pinplugins.com/' );
		}
	}
	
	/**
	 * Easy Digital Download Plugin Updater Code.
	 *
	 * @since     1.0.0
	 */
	public function wcrp_edd_sl_updater() {
		global $wcrp_options;
		
		if( !class_exists( 'EDD_SL_Plugin_Updater' ) ) {
			// load our custom updater
			include_once( 'includes/EDD_SL_Plugin_Updater.php' );
		}
		
		if( ! empty( $wcrp_options['wcrp_license_key'] ) ) {
			
			// Set the license key
			$license_key = $wcrp_options['wcrp_license_key'];
			
			// setup the updater
			$edd_updater = new EDD_SL_Plugin_Updater( $this->wcrp_edd_sl_store_url, WCRP_MAIN_FILE, array(
					'version'   => self::VERSION, // current plugin version number
					'license'   => $license_key, // license key (used get_option above to retrieve from DB)
					'item_name' => $this->wcrp_edd_sl_item_name, // name of this plugin
					'author'    => $this->wcrp_edd_sl_author // author of this plugin
				)
			);
		}
	}
	
	/*
	 * Load admin CSS files
	 * 
	 * @since 1.0.0
	 */
	public function enqueue_admin_styles() {
		if ( $this->viewing_this_plugin() ) {
			wp_enqueue_style( $this->plugin_slug .'-admin-styles', plugins_url( 'css/admin.css', __FILE__ ), array(), self::VERSION );
		}
	}

	/**
	 * Fired when the plugin is activated.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		update_option( 'wcrp_show_admin_install_notice', 1 );
	}

	/**
	 * WooCommerce inactive notice.
	 *
	 * @since    1.0.0
	 */
	public function wc_inactive_notice() {
		if ( ! wcrp_is_woocommerce_active() ) {
			add_settings_error( 'wcrp', 'wc-inactive', __( 'WooCommerce 2.0 is required to use \'' . $this->get_plugin_title() . '\'. Please install and activate WooCommerce.', 'wcrp' ), 'error' );
		}
		
		if( get_current_screen()->id == 'plugins' ) {
			settings_errors( 'wcrp' );
		}
	}

	/**
	 * Return an instance of this class.
	 *
	 * @since     1.0.0
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Returns the plugin title
	 *
	 * @since    1.0.0
	 */
	public static function get_plugin_title() {
		return __( 'Product Rich Pins for WooCommerce', 'wcrp' );
	}

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		$domain = $this->plugin_slug;
		$locale = apply_filters( 'plugin_locale', get_locale(), $domain );

		load_textdomain( $domain, trailingslashit( WP_LANG_DIR ) . $domain . '/' . $domain . '-' . $locale . '.mo' );
		load_plugin_textdomain( $domain, FALSE, basename( dirname( __FILE__ ) ) . '/languages' );
	}

	
	/**
	 * Register the administration menu for this plugin into the WordPress Dashboard menu.
	 *
	 * @since    1.0.0
	 */
	public function add_plugin_admin_menu() {
		// Add WooCommerce Products submenu item
		$this->plugin_screen_hook_suffix[] = add_submenu_page(
			'edit.php?post_type=product',
			$this->get_plugin_title(),
			__( 'Product Rich Pins', $this->plugin_slug ),
			'manage_options',
			$this->plugin_slug,
			array( $this, 'display_plugin_admin_page' )
		);

	}

	/**
	 * Render the settings page for this plugin.
	 *
	 * @since    1.0.0
	 */
	public function display_plugin_admin_page() {
		include_once( 'views/admin.php' );
	}

	/**
	 * Add settings action link to the plugins page.
	 *
	 * @since    1.0.0
	 */
	public function add_action_links( $links ) {

		return array_merge(
			array(
				'settings' => '<a href="' . admin_url( 'plugins.php?page=' . $this->plugin_slug ) . '">' . __( 'Settings', $this->plugin_slug ) . '</a>'
			),
			$links
		);

	}
	
	/**
	 * Render the post meta for this plugin.
	 *
	 * @since    1.0.0
	 */
	public function display_post_meta() {
		
		// First check if WooCommerce is active and "Product" custom post type exists
		if( wcrp_is_woocommerce_active() && wcrp_is_post_type( 'product' ) ) {
			
			// Add the meta boxes for Products
			add_meta_box( 'wcrp-meta', __( 'Product Rich Pins', 'wcrp' ), 'wcrp_add_meta_form', 'Product', 'advanced', 'high' );

			// function to output the HTML for meta box
			function wcrp_add_meta_form( $post ) {

				wp_nonce_field( basename( __FILE__ ), 'wcrp_meta_nonce' );

				include_once( 'views/post-meta-display.php' );
			}
		}
	}
	
	
	/**
	 * Save the post meta for this plugin.
	 *
	 * @since    1.0.0
	 *
	 * @param   int  $post_id
	 * @return  int  $post_id
	 */
	public function save_meta_data( $post_id ) {
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE )
			return $post_id;
		
		$post_meta_fields = array( 
			'wcrp_brand_name'
		);
		
		// Loop through our array and make sure it is posted and not empty in order to update it, otherwise we delete it
		foreach ( $post_meta_fields as $pmf ) {
			if ( isset( $_POST[$pmf] ) && !empty( $_POST[$pmf] ) ) {
				update_post_meta( $post_id, $pmf, sanitize_text_field( stripslashes( $_POST[$pmf] ) ) );
			} else {
				delete_post_meta( $post_id, $pmf );
			}
		}

		return $post_id;
	}
	
	/**
	 * Add Settings action link to left of existing action links on plugin listing page.
	 *
	 * @since   1.0.0
	 *
	 * @param   array  $links  Default plugin action links.
	 * @return  array  $links  Amended plugin action links.
	 */
	public function settings_link( $links ) {
		$setting_link = sprintf( '<a href="%s">%s</a>', add_query_arg( 'page', $this->plugin_slug, admin_url( 'admin.php' ) ), __( 'Settings', 'wcrp' ) );
		array_unshift( $links, $setting_link );

		return $links;
	}
	
	/**
	 * Check if viewing one of this plugin's admin pages.
	 *
	 * @since   1.0.0
	 *
	 * @return  bool
	 */
	private function viewing_this_plugin() {
		if ( ! isset( $this->plugin_screen_hook_suffix ) )
			return false;

		$screen = get_current_screen();

		if ( in_array( $screen->id, $this->plugin_screen_hook_suffix ) )
			return true;
		else
			return false;
	}

	/**
	 * Show notice after plugin install/activate in admin dashboard until user acknowledges.
	 * Also check if user chooses to hide it.
	 *
	 * @since   1.0.0
	 */
	public function admin_install_notice() {
		// Exit all of this if stored value is false/0 or not set.
		if ( false == get_option( 'wcrp_show_admin_install_notice' ) )
			return;

		// Delete stored value if "hide" button click detected (custom querystring value set to 1).
		// or if on a an admin page. Then exit.
		if ( ! empty( $_REQUEST['wcrp-dismiss-install-nag'] ) || $this->viewing_this_plugin() ) {
			delete_option( 'wcrp_show_admin_install_notice' );
			return;
		}

		// At this point show install notice. Show it only on the plugin screen.
		if( get_current_screen()->id == 'plugins' )
			include_once( 'views/admin-install-notice.php' );
	}
}
