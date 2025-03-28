
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

    }
}
