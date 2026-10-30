package com.datamanagement.archive;

import android.content.res.Configuration;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final int LIGHT_BG_COLOR = Color.parseColor("#F2F0EA");
    private static final int DARK_BG_COLOR = Color.parseColor("#0C0C0E");

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(StorageExportPlugin.class);
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        if (window != null) {
            // Unify edge-to-edge inset dispatch across Android 7–16 (API 24–36)
            WindowCompat.setDecorFitsSystemWindows(window, false);
        }

        View contentView = findViewById(android.R.id.content);
        if (contentView != null) {
            ViewCompat.setOnApplyWindowInsetsListener(
                contentView,
                (view, windowInsets) -> {
                    Insets insets = windowInsets.getInsets(
                        WindowInsetsCompat.Type.systemBars()
                            | WindowInsetsCompat.Type.displayCutout()
                            | WindowInsetsCompat.Type.ime()
                    );
                    view.setPadding(insets.left, insets.top, insets.right, insets.bottom);
                    return WindowInsetsCompat.CONSUMED;
                }
            );
            ViewCompat.requestApplyInsets(contentView);
        }

        boolean systemDark =
            (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK)
                == Configuration.UI_MODE_NIGHT_YES;
        applySystemBarTheme(systemDark);

        if (getBridge() != null) {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.addJavascriptInterface(new SystemBarBridge(), "AndroidSystemBars");
            }
        }
    }

    @SuppressWarnings("deprecation")
    private void applySystemBarTheme(boolean isDark) {
        int bgColor = isDark ? DARK_BG_COLOR : LIGHT_BG_COLOR;
        Window window = getWindow();
        if (window == null) {
            return;
        }

        View contentView = findViewById(android.R.id.content);
        if (contentView != null) {
            contentView.setBackgroundColor(bgColor);
        }
        window.getDecorView().setBackgroundColor(bgColor);

        if (Build.VERSION.SDK_INT < 35) {
            window.setStatusBarColor(bgColor);
            window.setNavigationBarColor(bgColor);
        }

        WindowInsetsControllerCompat controller =
            WindowCompat.getInsetsController(window, window.getDecorView());
        if (controller != null) {
            controller.setAppearanceLightStatusBars(!isDark);
            controller.setAppearanceLightNavigationBars(!isDark);
        }
    }

    private final class SystemBarBridge {
        @JavascriptInterface
        public void setTheme(final boolean isDark) {
            runOnUiThread(() -> applySystemBarTheme(isDark));
        }
    }
}
