
package org.mises.bytecode;

import org.objectweb.asm.ClassVisitor;

public class MisesBottomSheetControllerImplClassAdapter extends MisesClassVisitor {
    static String sBottomSheetControllerImpClassName =
            "org/chromium/components/browser_ui/bottomsheet/BottomSheetControllerImpl";
    static String sMisesBottomSheetControllerImpClassName =
            "org/chromium/components/browser_ui/bottomsheet/MisesBottomSheetControllerImpl";

    public MisesBottomSheetControllerImplClassAdapter(ClassVisitor visitor) {
        super(visitor);

        redirectConstructor(
                sBottomSheetControllerImpClassName, sMisesBottomSheetControllerImpClassName);
        
        deleteField(sMisesBottomSheetControllerImpClassName, "mBottomSheetContainer");
        makeProtectedField(sBottomSheetControllerImpClassName, "mBottomSheetContainer");

        //deleteMethod(sMisesBottomSheetControllerImpClassName, "initializeSheet");
        addMethodAnnotation(
                sMisesBottomSheetControllerImpClassName,
                "initializeSheet",
                "Ljava/lang/Override;");
        makePublicMethod(sBottomSheetControllerImpClassName, " initializeSheet");

        // deleteField(sMisesBottomControlsMediatorClassName, "mBottomControlsHeight");
        // makeProtectedField(sBottomControlsMediatorClassName, "mBottomControlsHeight");

        // deleteField(sMisesBottomControlsMediatorClassName, "mModel");
        // makeProtectedField(sBottomControlsMediatorClassName, "mModel");

        // deleteField(sMisesBottomControlsMediatorClassName, "mBrowserControlsSizer");
        // makeProtectedField(sBottomControlsMediatorClassName, "mBrowserControlsSizer");
    }
}
