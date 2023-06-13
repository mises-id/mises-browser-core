
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#import "mises/ios/browser/ui/mises_share/mises_share_view_controller.h"
#import "mises/ios/browser/ui/mises_share/mises_share_util.h"

#import "ios/chrome/common/ui/colors/semantic_color_names.h"
#import "ios/chrome/common/ui/confirmation_alert/confirmation_alert_action_handler.h"
#import "ios/chrome/common/ui/util/button_util.h"
#import "ios/chrome/common/ui/util/constraints_ui_util.h"
#import "ios/chrome/common/ui/util/image_util.h"
#include "ios/chrome/grit/ios_strings.h"
#include "ui/base/l10n/l10n_util_mac.h"

#import <MaterialComponents/MDCBaseTextArea.h>

#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif

namespace {

//const CGFloat kThumbImageSize = 200.0;
constexpr CGFloat kGeneratedImagePadding = 20;
//constexpr CGFloat kButtonMaxWidth = 327;
constexpr CGFloat kContentMaxWidth = 500;
constexpr CGFloat kMargin = 24;
//constexpr CGFloat kBottomMargin = 24;
constexpr CGFloat kImageSize = 60;
constexpr CGFloat kItemHeight = 80;
constexpr CGFloat kInputHeight = 300;

}  // namespace

@interface MisesShareViewController ()<UITextViewDelegate>

// Container view that will wrap the views making up the content.
@property(nonatomic, strong) UIStackView* stackView;

@property(nonatomic, strong) UILabel* titleView;
@property(nonatomic, strong) UIImageView* thumbView;
@property(nonatomic, strong) MDCBaseTextArea* commentView;

// URL of the page to mises share for.
@property(nonatomic, copy) NSURL* pageURL;

@property(nonatomic, copy) NSString* pageTitle;

@property(nonatomic, strong) NSArray* regularHeightToolbarItems;
@property(nonatomic, strong) NSArray* compactHeightToolbarItems;
@property(nonatomic, strong) UIToolbar* topToolbar;
@property(nonatomic, strong) UIActivityIndicatorView* activityIndicatorView;
@property(nonatomic, strong) UIActivityIndicatorView* linkActivityIndicatorView;

@property(nonatomic, strong)
    NSLayoutConstraint* regularHeightScrollViewBottomVerticalConstraint;
@property(nonatomic, strong)
    NSLayoutConstraint* compactHeightScrollViewBottomVerticalConstraint;

@end

@implementation MisesShareViewController

- (instancetype)initWithTitle:(NSString*)title pageURL:(NSURL*)pageURL {
  self = [super initWithNibName:nil bundle:nil];
  if (self) {
    _pageURL = pageURL;
    _pageTitle = title;
  }
  return self;
}

#pragma mark - Properties

- (UIImage*)content {
  UIEdgeInsets padding =
      UIEdgeInsetsMake(kGeneratedImagePadding, kGeneratedImagePadding,
                       kGeneratedImagePadding, kGeneratedImagePadding);
  return ImageFromView(self.stackView, self.view.backgroundColor, padding);
}

#pragma mark - UIViewController

- (void)viewDidLoad {
  [super viewDidLoad];

  self.view.backgroundColor = [UIColor colorNamed:kBackgroundColor];

  UIToolbar* topToolbar = [self createTopToolbar];
  self.topToolbar = topToolbar;
  [self.view addSubview:topToolbar];

  UIScrollView* scrollView = [[UIScrollView alloc] init];
  scrollView.translatesAutoresizingMaskIntoConstraints = NO;
  [self.view addSubview:scrollView];

  UIView * itemView = [self sharedItemView];
  self.commentView = [self createTextView];
  
  UIStackView* stackView = [[UIStackView alloc]
      initWithArrangedSubviews:@[ self.commentView, itemView ]];
  self.stackView = stackView;
  stackView.spacing = 8;
  stackView.axis = UILayoutConstraintAxisVertical;
  stackView.translatesAutoresizingMaskIntoConstraints = NO;
  stackView.alignment = UIStackViewAlignmentCenter;
  [scrollView addSubview:stackView];

  // UIButton* primaryActionButton = [self createPrimaryActionButton];
  // _primaryActionButton = primaryActionButton;
  // [self.view addSubview:primaryActionButton];

  // Toolbar constraints to the top.
  AddSameConstraintsToSides(
      topToolbar, self.view.safeAreaLayoutGuide,
      LayoutSides::kTrailing | LayoutSides::kTop | LayoutSides::kLeading);

  // Content size of the scrollview.
  AddSameConstraintsWithInsets(stackView, scrollView,
                               ChromeDirectionalEdgeInsetsMake(0, 0, 20, 0));
  // Scroll View constraints to the height of its content. Can be overridden.
  NSLayoutConstraint* heightConstraint = [scrollView.heightAnchor
      constraintEqualToAnchor:scrollView.contentLayoutGuide.heightAnchor];
  // UILayoutPriorityDefaultHigh is the default priority for content
  // compression. Setting this lower avoids compressing the content of the
  // scroll view.
  heightConstraint.priority = UILayoutPriorityDefaultHigh - 1;
  heightConstraint.active = YES;

  NSLayoutConstraint* stackViewWidth = [stackView.widthAnchor
      constraintEqualToAnchor:self.view.safeAreaLayoutGuide.widthAnchor];
  stackViewWidth.priority = UILayoutPriorityRequired - 1;

  // NSLayoutConstraint* lowPriorityWidthConstraint =
  //     [primaryActionButton.widthAnchor
  //         constraintEqualToConstant:kButtonMaxWidth];
  // lowPriorityWidthConstraint.priority = UILayoutPriorityDefaultHigh;

  // NSLayoutConstraint* scrollViewY = [scrollView.topAnchor
  //     constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor];
  // scrollViewY.priority = UILayoutPriorityDefaultHigh;

  [NSLayoutConstraint activateConstraints:@[
    [scrollView.topAnchor
        constraintEqualToAnchor:topToolbar.bottomAnchor constant:kMargin],
    [scrollView.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor],
    [scrollView.trailingAnchor
        constraintEqualToAnchor:self.view.trailingAnchor],
    [itemView.leadingAnchor
     constraintEqualToAnchor:stackView.leadingAnchor constant:kMargin],
    [itemView.trailingAnchor
     constraintEqualToAnchor:stackView.trailingAnchor constant:-kMargin],
    [self.commentView.leadingAnchor
     constraintEqualToAnchor:stackView.leadingAnchor constant:kMargin],
    [self.commentView.trailingAnchor
     constraintEqualToAnchor:stackView.trailingAnchor constant:-kMargin],
    [self.commentView.heightAnchor
        constraintEqualToConstant:kInputHeight],
    [itemView.heightAnchor
        constraintEqualToConstant:kItemHeight],

   // scrollViewY,

    [stackView.widthAnchor
        constraintLessThanOrEqualToConstant:kContentMaxWidth],
    [stackView.centerXAnchor constraintEqualToAnchor:scrollView.centerXAnchor],

    // [primaryActionButton.bottomAnchor
    //     constraintEqualToAnchor:self.view.safeAreaLayoutGuide.bottomAnchor
    //                    constant:-kBottomMargin],
    // [primaryActionButton.leadingAnchor
    //     constraintGreaterThanOrEqualToAnchor:scrollView.leadingAnchor],
    // [primaryActionButton.trailingAnchor
    //     constraintLessThanOrEqualToAnchor:scrollView.trailingAnchor],
    // [primaryActionButton.centerXAnchor
    //     constraintEqualToAnchor:self.view.centerXAnchor],
    //lowPriorityWidthConstraint

  ]];

  self.regularHeightScrollViewBottomVerticalConstraint =
      [scrollView.bottomAnchor
          constraintLessThanOrEqualToAnchor:self.view.safeAreaLayoutGuide
                                                .bottomAnchor
                                   constant:-8];
  self.compactHeightScrollViewBottomVerticalConstraint =
      [scrollView.bottomAnchor
          constraintLessThanOrEqualToAnchor:self.view.safeAreaLayoutGuide
                                                .bottomAnchor
                                   constant:-8];
}

- (void)traitCollectionDidChange:(UITraitCollection*)previousTraitCollection {
  [super traitCollectionDidChange:previousTraitCollection];

  // Update constraints for different size classes.
  BOOL hasNewVerticalSizeClass = previousTraitCollection.verticalSizeClass !=
                                 self.traitCollection.verticalSizeClass;

  if (hasNewVerticalSizeClass) {
    [self.view setNeedsUpdateConstraints];
  }
}

- (void)updateViewConstraints {
  BOOL isVerticalCompact =
      self.traitCollection.verticalSizeClass == UIUserInterfaceSizeClassCompact;

  //[self.primaryActionButton setHidden:isVerticalCompact];

  NSLayoutConstraint* oldBottomConstraint;
  NSLayoutConstraint* newBottomConstraint;
  if (isVerticalCompact) {
    oldBottomConstraint = self.regularHeightScrollViewBottomVerticalConstraint;
    newBottomConstraint = self.compactHeightScrollViewBottomVerticalConstraint;

    // Use setItems:animated method instead of setting the items property, as
    // that causes issues with the Done button. See crbug.com/1082723
    [self.topToolbar setItems:self.compactHeightToolbarItems animated:YES];
  } else {
    oldBottomConstraint = self.compactHeightScrollViewBottomVerticalConstraint;
    newBottomConstraint = self.regularHeightScrollViewBottomVerticalConstraint;

    // Use setItems:animated method instead of setting the items property, as
    // that causes issues with the Done button. See crbug.com/1082723
    [self.topToolbar setItems:self.regularHeightToolbarItems animated:YES];
  }

  [NSLayoutConstraint deactivateConstraints:@[ oldBottomConstraint ]];
  [NSLayoutConstraint activateConstraints:@[ newBottomConstraint ]];

  // Allow toolbar to update its height based on new layout.
  [self.topToolbar invalidateIntrinsicContentSize];

  [super updateViewConstraints];
}

#pragma mark - Private Methods


// Helper to create the top toolbar.
- (UIToolbar*)createTopToolbar {
  UIToolbar* topToolbar = [[UIToolbar alloc] init];
  topToolbar.translucent = NO;
  [topToolbar setShadowImage:[[UIImage alloc] init]
          forToolbarPosition:UIBarPositionAny];
  [topToolbar setBarTintColor:[UIColor colorNamed:kBackgroundColor]];

  NSMutableArray* regularHeightItems = [[NSMutableArray alloc] init];
  NSMutableArray* compactHeightItems = [[NSMutableArray alloc] init];
  UIBarButtonItem* shareButton =
      [[UIBarButtonItem alloc] initWithTitle:l10n_util::GetNSString(IDS_IOS_SHARE_BUTTON_LABEL)
                                       style:UIBarButtonItemStylePlain
                                      target:self
                                      action:@selector(didTapShareButton)];
  

  // shareButton.isAccessibilityElement = YES;
  // shareButton.accessibilityLabel =
  //     l10n_util::GetNSString(IDS_IOS_HELP_ACCESSIBILITY_LABEL);


  // Add margin with help button.
  UIBarButtonItem* fixedSpacer = [[UIBarButtonItem alloc]
      initWithBarButtonSystemItem:UIBarButtonSystemItemFixedSpace
                           target:nil
                           action:nil];
  fixedSpacer.width = 15.0f;
  

  // UIBarButtonItem* primaryActionBarButton = [[UIBarButtonItem alloc]
  //     initWithBarButtonSystemItem:UIBarButtonSystemItemAction
  //                          target:self
  //                          action:@selector(didTapPrimaryActionButton)];

  

  UIBarButtonItem* spacer = [[UIBarButtonItem alloc]
      initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace
                           target:nil
                           action:nil];

  UIBarButtonItem* dismissButton = [[UIBarButtonItem alloc]
      initWithBarButtonSystemItem:UIBarButtonSystemItemCancel
                           target:self
                           action:@selector(didTapDismissBarButton)];

  [regularHeightItems addObject:dismissButton];
  [compactHeightItems addObject:dismissButton];

  [regularHeightItems addObject:spacer];
  [compactHeightItems addObject:spacer];

// Only shows up in constraint height mode.
  //[compactHeightItems addObject:primaryActionBarButton];
  [compactHeightItems addObject:fixedSpacer];

  [regularHeightItems addObject:shareButton];
  [compactHeightItems addObject:shareButton];

  // Set the help button as the left button item so it can be used as a
  // popover anchor.
  //_helpButton = helpButton;
  _shareButton = shareButton;

  

  topToolbar.translatesAutoresizingMaskIntoConstraints = NO;

  self.regularHeightToolbarItems = regularHeightItems;
  self.compactHeightToolbarItems = compactHeightItems;

  return topToolbar;
}

// Handles taps on the dismiss button.
- (void)didTapDismissBarButton {
  if ([self.actionHandler
          respondsToSelector:@selector(confirmationAlertDismissAction)]) {
    [self.actionHandler confirmationAlertDismissAction];
  }
}

// Handles taps on the help button.
- (void)didTapShareButton {
  [self.actionHandler confirmationAlertPrimaryAction];
  _shareButton.enabled = NO;
  _commentView.enabled = NO;

  [self showLoadingIndicator];
}

// Handles taps on the primary action button.
- (void)didTapPrimaryActionButton {
  [self.actionHandler confirmationAlertPrimaryAction];
  //_primaryActionButton.enabled = NO;

  //[_primaryActionButton setBackgroundColor:UIColor.lightGrayColor];
}

// Helper to create the image view.
- (UIImageView*)createImageView {
  UIImageView* imageView =
      [[UIImageView alloc] init];
  imageView.contentMode = UIViewContentModeScaleAspectFit;

  imageView.isAccessibilityElement = YES;
  imageView.accessibilityLabel =
      l10n_util::GetNSString(IDS_IOS_MISES_SHARE_ACCESSIBILITY_LABEL);

  imageView.translatesAutoresizingMaskIntoConstraints = NO;
  
  return imageView;
}

// Helper to create the title label.
- (UILabel*)createTitleLabel {
  UILabel* title = [[UILabel alloc] init];
  title.numberOfLines = 1;
  title.font = [UIFont boldSystemFontOfSize:16];
  title.textColor = [UIColor colorNamed:kTextPrimaryColor];
  title.text = self.pageTitle;
  title.textAlignment = NSTextAlignmentLeft;
  title.translatesAutoresizingMaskIntoConstraints = NO;
  title.adjustsFontForContentSizeCategory = YES;
  return title;
}

// Helper to create the subtitle label.
- (UILabel*)createSubtitleLabel {
  UILabel* subtitle = [[UILabel alloc] init];
  subtitle.font = [UIFont systemFontOfSize:12];
  subtitle.numberOfLines = 1;
  subtitle.textColor = [UIColor colorNamed:kTextSecondaryColor];
  subtitle.text = [self.pageURL host];
  subtitle.textAlignment = NSTextAlignmentLeft;
  subtitle.translatesAutoresizingMaskIntoConstraints = NO;
  subtitle.adjustsFontForContentSizeCategory = YES;
  return subtitle;
}


- (MDCBaseTextArea*)createTextView {
    MDCBaseTextArea* input = [[MDCBaseTextArea alloc] init];
  input.textView.font = [UIFont preferredFontForTextStyle:UIFontTextStyleBody];
  input.textView.textColor = [UIColor colorNamed:kTextSecondaryColor];
    input.textView.delegate = self;
  input.placeholder = @"Say someting ...";
    input.preferredContainerHeight = kInputHeight;
  input.textView.textAlignment = NSTextAlignmentLeft;
    input.translatesAutoresizingMaskIntoConstraints = NO;
    input.adjustsFontForContentSizeCategory = YES;
    input.textView.translatesAutoresizingMaskIntoConstraints = NO;
    input.textView.adjustsFontForContentSizeCategory = YES;
   // [input.textView setReturnKeyType:UIReturnKeyDone];
    
    UIBarButtonItem* doneButton = [[UIBarButtonItem alloc]
        initWithBarButtonSystemItem:UIBarButtonSystemItemDone
                             target:self
                             action:@selector(didTapDoneButton)];
    UIBarButtonItem* spacer = [[UIBarButtonItem alloc]
        initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace
                             target:nil
                             action:nil];
    UIToolbar* toolbar = [[UIToolbar alloc] init];
    toolbar.translucent = YES;
    toolbar.frame = CGRectMake(0, 0, self.view.frame.size.width, 44);
    toolbar.items = @[spacer, doneButton];
    
    input.textView.inputAccessoryView = toolbar;
    input.layer.borderWidth = 0;
    input.layer.cornerRadius = 5;
    [input setBackgroundColor:[UIColor colorNamed:kGrey50Color]];
  return input;
}

- (UIView*)sharedItemView {

  
  UILabel* title = [self createTitleLabel];
  UILabel* subtitle = [self createSubtitleLabel];


  UIImageView* image = [self createImageView];
  self.thumbView = image;
    self.titleView = title;

  NSLayoutConstraint* imageWidthConstraint =
      [image.widthAnchor constraintEqualToConstant:0];
  imageWidthConstraint.priority = UILayoutPriorityDefaultHigh;
  imageWidthConstraint.active = YES;

  [image.heightAnchor
      constraintEqualToAnchor:image.widthAnchor]
      .active = YES;
  [image setContentMode:UIViewContentModeScaleAspectFill];
  [image setClipsToBounds:YES];

  [title
      setContentCompressionResistancePriority:UILayoutPriorityDefaultLow
                                      forAxis:UILayoutConstraintAxisHorizontal];
  [title setContentHuggingPriority:UILayoutPriorityDefaultHigh
                                 forAxis:UILayoutConstraintAxisVertical];
  [subtitle setContentHuggingPriority:UILayoutPriorityDefaultHigh
                               forAxis:UILayoutConstraintAxisVertical];

  [subtitle
      setContentCompressionResistancePriority:UILayoutPriorityDefaultLow
                                      forAxis:UILayoutConstraintAxisHorizontal];

  UIView *titleURLContainer = [[UIView alloc] initWithFrame:CGRectZero];
  [titleURLContainer setTranslatesAutoresizingMaskIntoConstraints:NO];

  [titleURLContainer addSubview:title];
  [titleURLContainer addSubview:subtitle];

  UIView * itemView = [[UIView alloc] init];
  [itemView setTranslatesAutoresizingMaskIntoConstraints:NO];
    [itemView addSubview:image];
  [itemView addSubview:titleURLContainer];
  
    itemView.layer.borderWidth = 0;
    itemView.layer.cornerRadius = 5;
    [itemView setBackgroundColor:[UIColor colorNamed:kGrey50Color]];

  [NSLayoutConstraint activateConstraints:@[
    [title.topAnchor
        constraintEqualToAnchor:titleURLContainer.topAnchor],
    [subtitle.topAnchor constraintEqualToAnchor:title.bottomAnchor],
    [subtitle.bottomAnchor
        constraintEqualToAnchor:titleURLContainer.bottomAnchor],
    [title.trailingAnchor
        constraintEqualToAnchor:titleURLContainer.trailingAnchor],
    [subtitle.trailingAnchor
        constraintEqualToAnchor:titleURLContainer.trailingAnchor],
    [title.leadingAnchor
        constraintEqualToAnchor:titleURLContainer.leadingAnchor],
    [subtitle.leadingAnchor
        constraintEqualToAnchor:titleURLContainer.leadingAnchor],
    [titleURLContainer.centerYAnchor
        constraintEqualToAnchor:itemView.centerYAnchor],
    [itemView.heightAnchor
        constraintGreaterThanOrEqualToAnchor:titleURLContainer.heightAnchor
                                    constant:2 * kGeneratedImagePadding],
    [titleURLContainer.trailingAnchor
        constraintEqualToAnchor:itemView.trailingAnchor
                       constant:-kGeneratedImagePadding],
    [image.leadingAnchor
        constraintEqualToAnchor:itemView.leadingAnchor
                       constant:kGeneratedImagePadding],
    [image.heightAnchor
        constraintEqualToConstant:kImageSize],
    [itemView.heightAnchor
        constraintGreaterThanOrEqualToAnchor:image.heightAnchor
                                    constant:2 * kGeneratedImagePadding],
    [image.centerYAnchor
        constraintEqualToAnchor:itemView.centerYAnchor],
  ]];

  NSLayoutConstraint* titleURLScreenshotConstraint =
      [titleURLContainer.leadingAnchor
          constraintEqualToAnchor:image.trailingAnchor];
  titleURLScreenshotConstraint.priority = UILayoutPriorityDefaultHigh;
  titleURLScreenshotConstraint.active = YES;
    titleURLScreenshotConstraint.constant = kGeneratedImagePadding;

  return itemView;
}


- (BOOL)textViewShouldEndEditing:(UITextView *)textView{
    NSLog(@"textViewShouldEndEditing:");
    return YES;
}
- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event{
    NSLog(@"touchesBegan:withEvent:");
    [self.view endEditing:YES];
    [super touchesBegan:touches withEvent:event];
}

- (void)didTapDoneButton {
    [self.view endEditing:YES];
}

- (void)textViewDidChange:(UITextView *)textView {
  [self.view setNeedsLayout];
  _commentText = textView.text;
}


// Helper to create the primary action button.
- (UIButton*)createPrimaryActionButton {
  UIButton* primaryActionButton = PrimaryActionButton(YES);
  [primaryActionButton addTarget:self
                          action:@selector(didTapPrimaryActionButton)
                forControlEvents:UIControlEventTouchUpInside];
  [primaryActionButton
      setTitle:l10n_util::GetNSString(IDS_IOS_SHARE_BUTTON_LABEL)
      forState:UIControlStateNormal];
  primaryActionButton.titleLabel.adjustsFontSizeToFitWidth = YES;
  [primaryActionButton
      setContentHuggingPriority:UILayoutPriorityDefaultHigh + 1
                        forAxis:UILayoutConstraintAxisVertical];

  return primaryActionButton;
}

- (void)updateThumbImage:(UIImage*)image {
  [self.thumbView setImage:image];
    
    [self.stackView invalidateIntrinsicContentSize];
    [self.view layoutIfNeeded];
}

- (void)updateTitle:(NSString*)title {
    [ self.titleView setText:title];
    [self.stackView invalidateIntrinsicContentSize];
    [self.view layoutIfNeeded];
}

- (void)reset {
  _shareButton.enabled = YES;
  _commentView.enabled = YES;
  [self hideLoadingIndicator];

}


// Shows a loading indicator,
- (void)showLoadingIndicator {
  DCHECK(!self.activityIndicatorView);
  self.activityIndicatorView = [[UIActivityIndicatorView alloc] init];
  UIActivityIndicatorView* activityView = self.activityIndicatorView;
  activityView.translatesAutoresizingMaskIntoConstraints = NO;
  [self.view addSubview:activityView];
  [NSLayoutConstraint activateConstraints:@[
    [activityView.centerXAnchor
        constraintEqualToAnchor:self.view.centerXAnchor],
    [activityView.centerYAnchor
        constraintEqualToAnchor:self.view.centerYAnchor],
  ]];
  [activityView startAnimating];
  activityView.color = [UIColor colorNamed:kBlueColor];
}

// Hides the loading indicator.
- (void)hideLoadingIndicator {
  [self.activityIndicatorView removeFromSuperview];
  self.activityIndicatorView = nil;
}


// Shows a link loading indicator,
- (void)showLinkLoadingIndicator {
  DCHECK(!self.linkActivityIndicatorView);
  self.linkActivityIndicatorView = [[UIActivityIndicatorView alloc] init];
  UIActivityIndicatorView* activityView = self.linkActivityIndicatorView;
  activityView.translatesAutoresizingMaskIntoConstraints = NO;
  [self.thumbView addSubview:activityView];
  [NSLayoutConstraint activateConstraints:@[
    [activityView.centerXAnchor
        constraintEqualToAnchor:self.thumbView.centerXAnchor],
    [activityView.centerYAnchor
        constraintEqualToAnchor:self.thumbView.centerYAnchor],
  ]];
  [activityView startAnimating];
  activityView.color = [UIColor colorNamed:kBlueColor];
}

// Hides the loading indicator.
- (void)hideLinkLoadingIndicator {
  [self.linkActivityIndicatorView removeFromSuperview];
  self.linkActivityIndicatorView = nil;
}


@end
