{
  'targets': [
    {
      'target_name': 'jot_cgal_addon-native',
      'sources': [ './jot_cgal_addon.cc' ],
      'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")", "..", "../glm", "/home/runner/boost/boost/boost"],
      'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],

      # 'cflags_cc': [ '-O3', '-DCGAL_USE_GLPK'],
      # 'cflags_cc': ['-fsanitize=address', '-g', '-DCGAL_USE_GLPK', '-fno-omit-frame-pointer'],
      # 'ldflags': ['-fsanitize=address'],
      # 'libraries': ['-lglpk', '-lgmpxx', '-lmpfr', '-lgmp'],

      'libraries': ['-lglpk', '-lgmpxx', '-lmpfr', '-lgmp'],
      'cflags_cc': ['-DCGAL_USE_GLPK'],
      'cflags_cc!': ['-fno-exceptions', '-fno-rtti'],
      'clang': 1,
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
