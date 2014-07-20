<?php

if ( file_exists( dirname( __FILE__ ) . '/local-config.php' ) ) {
  include( dirname( __FILE__ ) . '/local-config.php' );
  define( 'WP_LOCAL_DEV', true );
} else { 
  	define('DB_NAME', 'ohadev');

	/** MySQL database username */
	define('DB_USER', 'ohadev');

	/** MySQL database password */
	define('DB_PASSWORD', '95OOzNt6U2');

	/** MySQL hostname */
	define('DB_HOST', 'mysql.dreamfed.com');
}

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'a{86xmF`L,j8y@8swfX-v&&.)KIq.2U+zxE%M4K+OO50eZB/0oO]Z-lx%|Q|Qa-3');
define('SECURE_AUTH_KEY',  'bGV2>hnkNo<o%Jhey+_y>`Ozxm]]5^!fYwJNim$QIGNY!f1Z~M*ttRc.D(H66`<7');
define('LOGGED_IN_KEY',    'g$t;UH9Z|c%N$VCJJ${g$)ul~`bHISc4[M%|eip-,mwLjw)M+a;gr.u.^6NlS7od');
define('NONCE_KEY',        '.)]YK%M:k`+]}szf@e{+iW}IoVG~ySyv63d3e|B;Zd{}|-vZaP/_v~-}@uZ(eKWd');
define('AUTH_SALT',        'B+AzsZ<w*L-kIj.;?B{4MQMpv>SJPA~Qjii,Ef/U=lLaO&4|ez<MzDL`I._sAI#3');
define('SECURE_AUTH_SALT', ' bT4,)+)K@-+-i}~-Wu*@,O37XM4jEp-Cx9534}g`E+5pJqG`:}.F|Km)uG#OY3j');
define('LOGGED_IN_SALT',   '(p}DPa;|kdvicWKF*UssTqa+ru*Sh,>NkN=p}23-&D#M>z#+>=FKm$ttrS{%>agF');
define('NONCE_SALT',       'yX+w; Jf`)_rM|ApOdT%1._!~kLpBeVNRpvDf/X`;at[5>eRh6Jg{bl0.NJL(4Yr');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', 0);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');