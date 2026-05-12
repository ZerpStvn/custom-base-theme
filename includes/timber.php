<?php

use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\Cache\Adapter\TagAwareAdapter;
use Twig\Extra\Cache\CacheExtension;
use Twig\Extra\Cache\CacheRuntime;
use Twig\RuntimeLoader\RuntimeLoaderInterface;

add_filter('timber/locations', function ($paths) {
    $paths['components'] = [
        get_template_directory() . '/components'
    ];
    $paths['snippets'] = [
        get_template_directory() . '/snippets'
    ];
    $paths['partials'] = [
        get_template_directory() . '/partials'
    ];

    return $paths;
});

// Caching filters and options
if (_ENV == "development")
    define("_CACHE_KEY", rand());
else
    define("_CACHE_KEY", _S_VERSION);

add_filter("timber/context", function ($context) {
    $context["cache_key"] = _CACHE_KEY;

    return $context;
});

add_filter('timber/twig', function ($twig) {
    $twig->addRuntimeLoader(new class implements RuntimeLoaderInterface {
        public function load($class)
        {
            if (CacheRuntime::class === $class) {
                return new CacheRuntime(new TagAwareAdapter(new FilesystemAdapter('', 0, get_template_directory() . '/twig_cache')));
            }
        }
    });
    $twig->addExtension(new CacheExtension());

    return $twig;
});

add_filter('timber/twig/environment/options', function ($options) {
    if (_ENV == 'development') {
        $options["cache"] = false;
        $options['auto_reload'] = true;
    } else
        $options["cache"] = get_template_directory() . '/twig_cache';
    return $options;
});

apply_filters('timber/cache/mode', function () {
    if (_ENV == 'development')
        return Timber\Loader::CACHE_NONE;
    else
        return Tmber\Loader::CACHE_TRANSIENT;
});

add_filter('timber/context', function ($context) {
    $context['current_url'] = parse_url(Timber\URLHelper::get_current_url())["path"];

    return $context;
});

/*add_filter( 'timber/twig', function( \Twig\Environment $twig ) {
  $twig->addExtension(new IntlExtension());
});*/
