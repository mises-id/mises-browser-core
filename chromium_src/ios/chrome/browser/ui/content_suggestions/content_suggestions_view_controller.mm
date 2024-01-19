

#import "mises/ios/browser/ui/content_suggestions/cells/content_suggestions_mises_item.h"
#import "ios/chrome/browser/ui/content_suggestions/content_suggestions_view_controller.h"

namespace {
  NSString * const kboxFeatureTitle = @" Mises Features";
  NSString * const kboxWeb3Title = @" Web3 Sites";
  NSString * const kboxWeb3Enter = @"View all >";
}

@interface MisesWeb3Item : NSObject {
  ContentSuggestionsViewController* _controller;
}

@property(nonatomic, strong)
    NSMutableArray<UIStackView*>* mostVisitedHorizontalStackView;

@property(nonatomic, strong)
    NSMutableArray<UIStackView*>* misesFeatureHorizontalStackView;
@property(nonatomic, strong)
    NSMutableArray<UIStackView*>* web3SiteHorizontalStackView;
  
@property(nonatomic, strong)
    ContentSuggestionsMisesToggleCell* misesWeb3ToggleCell;
@property(nonatomic, strong)
    ContentSuggestionsMisesToggleCell* misesFeatureToggleCell;
@property(nonatomic, strong)
    ContentSuggestionsMisesEmptyCell* misesEmptyCell;

- (instancetype)init:(ContentSuggestionsViewController *)controller;
- (void) reset;
- (void) removeAllViews;
- (void) buildHorizontalMostVisitedStackViews;
-(CGSize) preferedSize;
@end

#define MISES_CONTENT_SUGGESTIONS_CONTENT_SUGGESTIONS_VIEW_CONTROLLER_PROP \
  @property(nonatomic, strong) MisesWeb3Item* misesWeb3Item;

#define MISES_CONTENT_SUGGESTIONS_CONTENT_SUGGESTIONS_VIEW_CONTROLLER_INIT \
  self.misesWeb3Item = [[MisesWeb3Item alloc] init:self];

#define MISES_CONTENT_SUGGESTIONS_CONTENT_SUGGESTIONS_VIEW_CONTROLLER_BUILD \
  [self.misesWeb3Item buildHorizontalMostVisitedStackViews];


#define MISES_CONTENT_SUGGESTIONS_CONTENT_SUGGESTIONS_VIEW_CONTROLLER_REMOVE \
    [self.misesWeb3Item removeAllViews]; 

#define MISES_CONTENT_SUGGESTIONS_CONTENT_SUGGESTIONS_VIEW_CONTROLLER_RESET \
    [self.misesWeb3Item reset]; 

#define MISES_CONTENT_SUGGESTIONS_CONTENT_SUGGESTIONS_VIEW_CONTROLLER_SIZE \
  [self.misesWeb3Item preferedSize]

#import "src/ios/chrome/browser/ui/content_suggestions/content_suggestions_view_controller.mm"


@implementation MisesWeb3Item


- (instancetype)init:(ContentSuggestionsViewController *)controller {
  _controller = controller;
  return [super init];
}

- (void) reset {
  self.mostVisitedHorizontalStackView = [NSMutableArray array];
  self.misesFeatureHorizontalStackView = [NSMutableArray array];
  self.web3SiteHorizontalStackView = [NSMutableArray array];
}
- (void) removeAllViews {
  for (UIStackView* view in self.mostVisitedHorizontalStackView) {
      [view removeFromSuperview];
  }
  [self.mostVisitedHorizontalStackView removeAllObjects];
  
  for (UIStackView* view in self.misesFeatureHorizontalStackView) {
      [view removeFromSuperview];
  }
  [self.misesFeatureHorizontalStackView removeAllObjects];

  for (UIStackView* view in self.web3SiteHorizontalStackView) {
      [view removeFromSuperview];
  }
  [self.web3SiteHorizontalStackView removeAllObjects];

  if (self.misesWeb3ToggleCell) {
      [self.misesWeb3ToggleCell removeFromSuperview];
      self.misesWeb3ToggleCell = nil;
  }
  if (self.misesFeatureToggleCell) {
      [self.misesFeatureToggleCell removeFromSuperview];
      self.misesFeatureToggleCell = nil;
  }
  if (self.misesEmptyCell) {
      [self.misesEmptyCell removeFromSuperview];
      self.misesEmptyCell = nil;
  }
}

- (void)toggleFeatureTapped {
  [_controller.suggestionCommandHandler toogleMisesFeature];
  [_controller.audience returnToRecentTabWasAdded];
  if (_controller.viewLoaded) {
      [_controller.view setNeedsLayout];
      [_controller.view layoutIfNeeded];
  }
  
}

- (void)toggleWeb3Tapped {
  [_controller.suggestionCommandHandler toogleWeb3Site];
  [_controller.audience returnToRecentTabWasAdded];
  if (_controller.viewLoaded) {
      [_controller.view setNeedsLayout];
      [_controller.view layoutIfNeeded];
  }
}

- (void)enterWeb3Tapped {
  [_controller.suggestionCommandHandler openMisesWeb3Home];
}

- (NSMutableArray *)buildHorizontalStackViews:(NSArray *)tileViews {
    NSMutableArray *horizontalStackView = [NSMutableArray array];
    UIStackView* current = NULL;
    CGFloat horizontalSpacing =
    ContentSuggestionsTilesHorizontalSpacing(_controller.traitCollection);
    CGFloat width =
    MostVisitedTilesContentHorizontalSpace(_controller.traitCollection);
    CGSize size =
    MostVisitedCellSize(_controller.traitCollection.preferredContentSizeCategory);
    for (ContentSuggestionsMostVisitedTileView* view in tileViews) {
        if (!current) {
            current = [[UIStackView alloc] init];
            current.axis = UILayoutConstraintAxisHorizontal;
            current.distribution = UIStackViewDistributionFillEqually;
            current.spacing = horizontalSpacing;
            current.alignment = UIStackViewAlignmentTop;
            [NSLayoutConstraint activateConstraints:@[
                [current.widthAnchor constraintEqualToConstant:width],
                [current.heightAnchor
                 constraintEqualToConstant:size.height]
            ]];
        }
        [current addArrangedSubview:view];
        if ([[current arrangedSubviews] count] == 4) {
            [horizontalStackView addObject:current];
            current = NULL;
        }
    }
    if (current) {
        [horizontalStackView addObject:current];
    }
    
    return horizontalStackView;
    
}

- (void)buildHorizontalMostVisitedStackViews  {
    NSMutableArray *mvTiles = [NSMutableArray array];
    NSMutableArray *web3Tiles = [NSMutableArray array];
    NSMutableArray *misesFeatureTiles = [NSMutableArray array];
    for (ContentSuggestionsMostVisitedTileView* view in _controller.mostVisitedViews) {
        if (view.config.itemType == ITEM_TYPE_MISES_FEATURE) {
          [misesFeatureTiles addObject:view];
        } else if (view.config.itemType == ITEM_TYPE_WEB3_SITE){
          [web3Tiles addObject:view];
        } else {
          [mvTiles addObject:view];
        }
    }
    
    
    self.misesFeatureHorizontalStackView = [self buildHorizontalStackViews:misesFeatureTiles];
    self.web3SiteHorizontalStackView = [self buildHorizontalStackViews:web3Tiles];
    self.mostVisitedHorizontalStackView = [self buildHorizontalStackViews:mvTiles];

    CGFloat width = MostVisitedTilesContentHorizontalSpace(_controller.traitCollection);
    

    {
      ContentSuggestionsMisesToggleCell *cell = [[ContentSuggestionsMisesToggleCell alloc] init];
      [NSLayoutConstraint activateConstraints:@[
          [cell.widthAnchor constraintEqualToConstant:width],
          [cell.heightAnchor
          constraintEqualToConstant:[ContentSuggestionsMisesToggleCell heightForWidth:width]]
      ]];
      [cell configureWith:kboxFeatureTitle enter:@""];
      [cell.toggleButton addTarget:self
                                action:@selector(toggleFeatureTapped)
                      forControlEvents:UIControlEventTouchUpInside];
      [cell toggle:[misesFeatureTiles count] != 0];
      [_controller.mostVisitedStackView addArrangedSubview:cell];
      self.misesFeatureToggleCell = cell;
    }

    for (UIStackView* view in self.misesFeatureHorizontalStackView) {
        [_controller.mostVisitedStackView addArrangedSubview:view];
    }
    
    {
      ContentSuggestionsMisesToggleCell *cell = [[ContentSuggestionsMisesToggleCell alloc] init];
      [NSLayoutConstraint activateConstraints:@[
          [cell.widthAnchor constraintEqualToConstant:width],
          [cell.heightAnchor
          constraintEqualToConstant:[ContentSuggestionsMisesToggleCell heightForWidth:width]]
      ]];
      [cell configureWith:kboxWeb3Title enter:kboxWeb3Enter];
      [cell.toggleButton addTarget:self
                                action:@selector(toggleWeb3Tapped)
                      forControlEvents:UIControlEventTouchUpInside];
      [cell.enterButton addTarget:self
                                action:@selector(enterWeb3Tapped)
                      forControlEvents:UIControlEventTouchUpInside];
      [cell toggle:[web3Tiles count] > 0];
      [_controller.mostVisitedStackView addArrangedSubview:cell];
      self.misesWeb3ToggleCell = cell;

    }

    for (UIStackView* view in self.web3SiteHorizontalStackView) {
        [_controller.mostVisitedStackView addArrangedSubview:view];
    }
    {
      ContentSuggestionsMisesEmptyCell *cell = [[ContentSuggestionsMisesEmptyCell alloc] init];
      [NSLayoutConstraint activateConstraints:@[
          [cell.widthAnchor constraintEqualToConstant:width],
          [cell.heightAnchor
          constraintEqualToConstant:[ContentSuggestionsMisesEmptyCell heightForWidth:width]]
      ]];
      [_controller.mostVisitedStackView addArrangedSubview:cell];
      self.misesEmptyCell = cell;

    }
                                       
    for (UIStackView* view in self.mostVisitedHorizontalStackView) {
        [_controller.mostVisitedStackView addArrangedSubview:view];
    }
    return;
}

-(CGSize) preferedSize {
  CGSize size = MostVisitedCellSize(UIApplication.sharedApplication.preferredContentSizeCategory);
  size.height = size.height*6;
  return size;
}
@end