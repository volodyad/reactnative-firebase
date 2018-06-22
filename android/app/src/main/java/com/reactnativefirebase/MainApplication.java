package com.reactnativefirebase;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.perf.RNFirebasePerformancePackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.google.firebase.database.FirebaseDatabase;

import com.google.firebase.perf.FirebasePerformance;
import com.google.firebase.perf.metrics.Trace;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
            new RNFirebasePackage(),
              new RNFirebaseAuthPackage(),
            new RNFirebaseDatabasePackage(),
              new RNFirebasePerformancePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FirebaseDatabase.getInstance().setPersistenceEnabled(true);
//    int oneMegabyte =  1 * 1024 * 1024;
//   FirebaseDatabase.getInstance().setPersistenceCacheSizeBytes(oneMegabyte);
    SoLoader.init(this, /* native exopackage */ false);

    FirebasePerformance.getInstance().setPerformanceCollectionEnabled(true);
    Trace myTrace = FirebasePerformance.getInstance().newTrace("test_trace");
    myTrace.start();
    myTrace.incrementMetric("item_cache_hit11", 1);
    myTrace.stop();
  }
}
