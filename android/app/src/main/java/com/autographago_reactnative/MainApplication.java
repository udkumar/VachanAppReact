package com.autographago_reactnative;
import android.app.Application;
import com.facebook.react.ReactApplication;
// import com.reactnativecommunity.netinfo.NetInfoPackage;
// import com.facebook.reactnative.androidsdk.FBSDKPackage;
// import co.apptailor.googlesignin.RNGoogleSigninPackage;
// import com.facebook.CallbackManager;

import com.brentvatne.react.ReactVideoPackage;
import io.realm.react.RealmReactPackage;
import com.rnziparchive.RNZipArchivePackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfs.RNFSPackage;
// import io.invertase.firebase.RNFirebasePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
 import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// import io.invertase.firebase.auth.RNFirebaseAuthPackage;
// import io.invertase.firebase.storage.RNFirebaseStoragePackage;
// import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
// import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
// import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  // private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  // protected static CallbackManager getCallbackManager() {
  //   return mCallbackManager;
  // }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            // new NetInfoPackage(),
            // new FBSDKPackage(mCallbackManager),
            // new RNGoogleSigninPackage(),
            new ReactVideoPackage(),
            new RealmReactPackage(),
            new RNZipArchivePackage(),
            new WebViewBridgePackage(),
            new VectorIconsPackage(),
            new RNFSPackage(),
            new AsyncStoragePackage()
            // new RNFirebasePackage(),
            // new RNFirebaseAuthPackage(),
            // new RNFirebaseStoragePackage(),
            // new RNFirebaseFirestorePackage(),
            // new RNFirebaseNotificationsPackage(),
            // new RNFirebaseMessagingPackage()
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
    SoLoader.init(this, /* native exopackage */ false);
  }
}
