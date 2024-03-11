{
  'targets': [
    {
      'target_name': 'jot_cgal_addon-native',
      'sources': [ './jot_cgal_addon.cc' ],
      'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")", "..", "../glm"],
      'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
      'libraries': ['-lglpk', '-lgmpxx', '-lmpfr', '-lgmp'],
      'cflags_cc': [ '-O3', '-DCGAL_USE_GLPK'],
      'cflags_cc!': [ '-fno-exceptions', '-fno-rtti' ],
      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
        'GCC_ENABLE_CPP_RTTI': 'YES',
        'CLANG_CXX_LIBRARY': 'libc++',
        'MACOSX_DEPLOYMENT_TARGET': '10.7'
      },
      'msvs_settings': {
        'VCCLCompilerTool': { 'ExceptionHandling': 1 },
      }
    }
  ]
}
