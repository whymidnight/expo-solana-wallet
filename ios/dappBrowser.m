//
//  dappBrowser.m
//  wallet
//
//  Created by ddigiacomo on 8/17/22.
//

#import <Foundation/Foundation.h>

#import <UIKit/UIKit.h>
#import <React/RCTUIManager.h>

#import <wallet-Swift.h>


@interface DappBrowserManager : RCTViewManager
@end

@implementation DappBrowserManager 

RCT_EXPORT_MODULE(DappBrowser)

- (UIView *)view {
    return [DappBrowserView new];
}

RCT_EXPORT_VIEW_PROPERTY(urlProp, NSString);
RCT_EXPORT_VIEW_PROPERTY(publicKeyProp, NSString);
RCT_EXPORT_VIEW_PROPERTY(privateKeyProp, NSString);

/*
RCT_EXTERN_METHOD(
  updateFromManager:(nonnull NSString *)node
)
*/

@end
