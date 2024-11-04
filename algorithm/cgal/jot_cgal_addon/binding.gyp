{
  'targets': [
    {
      'target_name': 'jot_cgal_addon-native',
      'sources': [ './jot_cgal_addon.cc' ],
      'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")", "..", "../glm", "../glm/glm", "../native/include", "../native/include/manifold"],
      'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
      # 'libraries': ['../../native/lib/libglpk.a', '../../native/lib/libgmpxx.a', '../../native/lib/libmpfr.a', '../../native/lib/libgmp.a', '../../native/lib/libmanifold.a', '../../native/lib/libClipper2.a', '../../native/lib/libpolygon.a'],
      'libraries': ['../../native/lib/libglpk.a', '../../native/lib/libgmpxx.a', '../../native/lib/libmpfr.a', '../../native/lib/libgmp.a', '../../native/lib/libmanifold.a'],
      # 'cflags_cc': ['-O3', '-fPIC', '-DCGAL_USE_GLPK'],
      # 'cflags_cc': ['-O2', '-fPIC', '-DCGAL_USE_GLPK', '-fsanitize=address'],
      # 'cflags_cc': ['-fPIC', '-DCGAL_USE_GLPK'],
      'cflags_cc': ['-fPIC', '-DCGAL_USE_GLPK', '-fsanitize=address'],
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
