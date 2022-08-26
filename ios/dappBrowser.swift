//
//  dappBrowser.swift
//  wallet
//
//  Created by ddigiacomo on 8/G7/22.
//

import Foundation
import WebKit
import FittedSheets
import UIKit
import TrustWeb3Provider
import WalletCore
import Base58Swift
import TweetNacl
// let data = try NaclSign.signDetached(message: signData, secretKey: signer.secretKey)


extension UIView {
  var parentViewController: UIViewController? {
    var parentResponder: UIResponder? = self
    while parentResponder != nil {
      parentResponder = parentResponder!.next
      if let viewController = parentResponder as? UIViewController {
        return viewController
      }
    }
    return nil
  }
}

@objc (DappBrowserView)
class DappBrowserView: UIView {
  weak var dappBrowserViewController: DAppWebViewController?
  var url: String = ""
  var publicKey: String = ""
  var privateKey: Data!
  
  /*
  @objc func updateUrl(value: NSString) {
    url = value as String
  }
  
  @objc func updateFromManager(_ node: NSNumber, value: NSString) {
    DispatchQueue.main.async {
      let component = self.bridge.uiManager.view(
        forReactTag: node
      ) as! DappBrowserView
      component.updateUrl(value: value)
    }
 }
 */
  
  // exported view property to be set in React Native
  @objc public var urlProp: NSString? {
    didSet {
      guard let url = self.urlProp else {
        self.url = ""
        return
      }
      self.url = url as String
    }
  }
  
  // exported view property to be set in React Native
  @objc public var publicKeyProp: NSString? {
    didSet {
      guard let publicKey = self.publicKeyProp else {
        self.publicKey = ""
        return
      }
      self.publicKey = publicKey as String
    }
  }
  
  @objc public var privateKeyProp: NSString? {
    didSet {
      print(self.privateKeyProp)
      guard let privateKey = self.privateKeyProp else {
        return
      }
      let keys = try! NaclSign.KeyPair.keyPair(fromSecretKey: Data(Base58.decodeNoCheck(string: privateKey as String)!))
      self.privateKey = keys.secretKey
    }
  }
  
  
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    print("init")
  }
  required init?(coder aDecoder: NSCoder) { fatalError("nope") }
  
  override func layoutSubviews() {
    super.layoutSubviews()
    
    if dappBrowserViewController == nil {
      print("mounting"  + " " + url)
      embed()
    }  else {
      dappBrowserViewController?.view.frame = bounds
    }
  }
  
  private func embed() {
    guard
      let parentVC = parentViewController
    else {
      print("fail")
      return
    }
    
    let vc = DAppWebViewController()
    
    vc.solanaPubkey = publicKey
    vc.keypair = self.privateKey
    vc.homepage = url
    parentVC.addChild(vc)
    addSubview(vc.view)
    vc.view.frame = bounds
    vc.didMove(toParent: parentVC)
    
    self.dappBrowserViewController = vc
  }
  
}

class DAppWebViewController: UIViewController {
  
  
  
  static let solanaRPC = "https://api.mainnet-beta.solana.com"
  
  lazy var homepage = ""
  lazy var solanaPubkey = ""
  var keypair: Data!
  
  
  
  var current: TrustWeb3Provider = TrustWeb3Provider(
    address: "0x9d8a62f656a8d1615c1294fd71e9cfb3e4855a4f",
    chainId: 1,
    rpcUrl: "https://cloudflare-eth.com"
  )
  
  func showModal(infoText: String, declineText: String, approveText: String, onApproval: @escaping () -> Void, onCancel: @escaping () -> Void) -> SheetViewController{
    let someController = PopuoutModalViewController()
    someController.infoText = infoText
    someController.declineText = declineText
    someController.approveText = approveText
    someController.onApprovalClosure = onApproval
    someController.onCancelClosure = onCancel
    let sheetViewController = SheetViewController(controller: someController, sizes: [.percent(0.25), .percent(0.6)])
    
    return sheetViewController
    
  }
  
  lazy var webview: WKWebView = {
    let config = WKWebViewConfiguration()
    
    let controller = WKUserContentController()
    
    controller.addUserScript(current.providerScript)
    controller.addUserScript(current.injectScript)
    controller.add(self, name: TrustWeb3Provider.scriptHandlerName)
    
    config.userContentController = controller
    config.allowsInlineMediaPlayback = true
    
    let webview = WKWebView(frame: self.view.frame, configuration: config)
    webview.translatesAutoresizingMaskIntoConstraints = false
    webview.uiDelegate = self
    
    return webview
  }()
  
  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    
    view.addSubview(webview)
    navigate(to: homepage)
  }
  
  func navigate(to url: String) {
    print("navigating")
    guard let url = URL(string: url) else { return }
    webview.load(URLRequest(url: url))
  }
}


extension DAppWebViewController: WKScriptMessageHandler {
  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    let json = message.json
    print(json)
    guard
      let method = extractMethod(json: json),
      let id = json["id"] as? Int64,
      let network = extractNetwork(json: json)
    else {
      return
    }
    switch method {
    case .requestAccounts:
      handleRequestAccounts(network: network, id: id)
    case .signRawTransaction:
      guard let raw = extractRaw(json: json) else {
        print("raw json is missing")
        return
      }
      
      handleSignRawTransaction(id: id, raw: raw)
    case .signMessage:
      guard let data = extractMessage(json: json) else {
        print("data is missing")
        return
      }
      switch network {
      case .ethereum:
        handleSignMessage(id: id, data: data, addPrefix: false)
      case .solana:
        handleSolanaSignMessage(id: id, data: data)
      }
    case .signPersonalMessage:
      guard let data = extractMessage(json: json) else {
        print("data is missing")
        return
      }
      handleSignMessage(id: id, data: data, addPrefix: true)
    case .signTypedMessage:
      guard
        let data = extractMessage(json: json),
        let raw = extractRaw(json: json)
      else {
        print("data or raw json is missing")
        return
      }
      handleSignTypedMessage(id: id, data: data, raw: raw)
    case .ecRecover:
      return
    case .addEthereumChain:
      guard let (chainId, name, rpcUrls) = extractChainInfo(json: json) else {
        print("extract chain info error")
        return
      }
    case .switchEthereumChain:
      guard
        let chainId = extractChainId(json: json)
      else {
        print("chain id is invalid")
        return
      }
      handleSwitchChain(id: id, chainId: chainId)
    default:
      break
    }
  }
  
  func handleRequestAccounts(network: ProviderNetwork, id: Int64) {
    let address = self.solanaPubkey
    present(self.showModal(
      infoText: "Connect Wallet to This Site?",
      declineText: "Cancel",
      approveText: "Connect",
      onApproval: {
        self.webview.tw.set(network: network.rawValue, address: address)
        self.webview.tw.send(network: network, results: [address], to: id)
        self.dismiss(animated: true, completion: nil)
      },
      onCancel: {
        self.webview.tw.send(network: network, error: "Canceled", to: id)
        self.dismiss(animated: true, completion: nil)
      }
    ), animated: true, completion: nil)
  }
  
  func handleSignMessage(id: Int64, data: Data, addPrefix: Bool) {
    /*
     let alert = UIAlertController(
     title: "Sign Ethereum Message",
     message: addPrefix ? String(data: data, encoding: .utf8) ?? "" : data.hexString,
     preferredStyle: .alert
     )
     alert.addAction(UIAlertAction(title: "Cancel", style: .destructive, handler: { [weak webview] _ in
     webview?.tw.send(network: .ethereum, error: "Canceled", to: id)
     }))
     alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { [weak webview] _ in
     let signed = self.signMessage(data: data, addPrefix: addPrefix)
     webview?.tw.send(network: .ethereum, result: "0x" + signed.hexString, to: id)
     }))
     present(alert, animated: true, completion: nil)
     */
  }
  
  func handleSignTypedMessage(id: Int64, data: Data, raw: String) {
    /*
     let alert = UIAlertController(
     title: "Sign Typed Message",
     message: raw,
     preferredStyle: .alert
     )
     alert.addAction(UIAlertAction(title: "Cancel", style: .destructive, handler: { [weak webview] _ in
     webview?.tw.send(network: .ethereum, error: "Canceled", to: id)
     }))
     alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { [weak webview] _ in
     let signed = self.signMessage(data: data, addPrefix: false)
     webview?.tw.send(network: .ethereum, result: "0x" + signed.hexString, to: id)
     }))
     present(alert, animated: true, completion: nil)
     */
  }
  
  func handleSolanaSignMessage(id: Int64, data: Data) {
    /*
     let alert = UIAlertController(
     title: "Sign Solana Message",
     message: String(data: data, encoding: .utf8) ?? data.hexString,
     preferredStyle: .alert
     )
     alert.addAction(UIAlertAction(title: "Cancel", style: .destructive, handler: { [weak webview] _ in
     }))
     alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { [weak webview] _ in
     }))
     webview?.tw.send(network: .solana, error: "Canceled", to: id)
     
     
     */
    // print(Base58.encode(data: data[0..<data.endIndex]))
    print(String(decoding: data, as: UTF8.self))
    present(self.showModal(
      infoText: "Sign Message",
      declineText: "Cancel",
      approveText: "Sign Message",
      onApproval: {
        print("approve")
        let signed = try! NaclSign.signDetached(message: data, secretKey: self.keypair)
        self.webview.tw.send(network: .solana, result: "0x" + signed.hexString, to: id)
        self.dismiss(animated: true, completion: nil)
      },
      onCancel: {
        self.webview.tw.send(network: .solana, error: "Canceled", to: id)
        self.dismiss(animated: true, completion: nil)
      }
    ), animated: true, completion: nil)
    
    
  }
  
  func handleSignRawTransaction(id: Int64, raw: String) {
    /*
     let alert = UIAlertController(
     title: "Sign Transaction",
     message: raw,
     preferredStyle: .alert
     )
     alert.addAction(UIAlertAction(title: "Cancel", style: .destructive, handler: { [weak webview] _ in
     webview?.tw.send(network: .solana, error: "Canceled", to: id)
     }))
     alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { [weak webview] _ in
     guard let decoded = Base58.decodeNoCheck(string: raw) else { return }
     guard let signature = Self.privateKey.sign(digest: decoded, curve: .ed25519) else { return }
     let signatureEncoded = Base58.encodeNoCheck(data: signature)
     webview?.tw.send(network: .solana, result: signatureEncoded, to: id)
     }))
     present(alert, animated: true, completion: nil)
     */
    present(self.showModal(
      infoText: "Approve Interaction",
      declineText: "Cancel",
      approveText: "Approve",
      onApproval: {
        print("tx")
        
        
        print(raw)
        let signature = try! NaclSign.signDetached(message: Base58.decodeNoCheck(string: raw)!, secretKey: self.keypair)
        print("sig" + " " + signature.hexString)
        self.webview.tw.send(network: .solana, result: Base58.encodeNoCheck(data: signature), to: id)
        self.dismiss(animated: true, completion: nil)
        
      },
      onCancel: {
        self.webview.tw.send(network: .solana, error: "Canceled", to: id)
        self.dismiss(animated: true, completion: nil)
      }
    ), animated: true, completion: nil)
  }
  
  func handleAddChain(id: Int64, name: String, chainId: Int, rpcUrls: [String]) {
  }
  
  func handleSwitchChain(id: Int64, chainId: Int) {
  }
  
  func alert(title: String, message: String) {
    let alert = UIAlertController(
      title: title,
      message: message,
      preferredStyle: .alert
    )
    alert.addAction(.init(title: "OK", style: .default, handler: nil))
    present(alert, animated: true, completion: nil)
  }
  
  private func extractMethod(json: [String: Any]) -> DAppMethod? {
    guard
      let name = json["name"] as? String
    else {
      return nil
    }
    return DAppMethod(rawValue: name)
  }
  
  private func extractNetwork(json: [String: Any]) -> ProviderNetwork? {
    guard
      let network = json["network"] as? String
    else {
      return nil
    }
    return ProviderNetwork(rawValue: network)
  }
  
  private func extractMessage(json: [String: Any]) -> Data? {
    guard
      let params = json["object"] as? [String: Any],
      let string = params["data"] as? String,
      let data = Data(hexString: String(Array(string)[2...string.count-1]))
    else {
      return nil
    }
    return data
  }
  
  /*
   private func extractSignature(json: [String: Any]) -> (signature: Data, message: Data)? {
   guard
   let params = json["object"] as? [String: Any],
   let signature = params["signature"] as? String,
   let message = params["message"] as? String
   else {
   return nil
   }
   return (Data(hexString: signature)!, Data(hexString: message)!)
   }
   */
  
  private func extractChainInfo(json: [String: Any]) ->(chainId: Int, name: String, rpcUrls: [String])? {
    guard
      let params = json["object"] as? [String: Any],
      let string = params["chainId"] as? String,
      let chainId = Int(String(string.dropFirst(2)), radix: 16),
      let name = params["chainName"] as? String,
      let urls = params["rpcUrls"] as? [String]
    else {
      return nil
    }
    return (chainId: chainId, name: name, rpcUrls: urls)
  }
  
  private func extractChainId(json: [String: Any]) -> Int? {
    guard
      let params = json["object"] as? [String: Any],
      let string = params["chainId"] as? String,
      let chainId = Int(String(string.dropFirst(2)), radix: 16),
      chainId > 0
    else {
      return nil
    }
    return chainId
  }
  
  private func extractRaw(json: [String: Any]) -> String? {
    guard
      let params = json["object"] as? [String: Any],
      let raw = params["raw"] as? String
    else {
      return nil
    }
    return raw
  }
  
  /*
   private func signMessage(data: Data, addPrefix: Bool = true) -> Data {
   let message = addPrefix ? Hash.keccak256(data: ethereumMessage(for: data)) : data
   var signed = Self.privateKey.sign(digest: message, curve: .secp256k1)!
   signed[64] += 27
   return signed
   }
   
   private func ecRecover(signature: Data, message: Data) -> String? {
   let data = ethereumMessage(for: message)
   let hash = Hash.keccak256(data: data)
   guard let publicKey = PublicKey.recover(signature: signature, message: hash),
   PublicKey.isValid(data: publicKey.data, type: publicKey.keyType) else {
   return nil
   }
   return CoinType.ethereum.deriveAddressFromPublicKey(publicKey: publicKey).lowercased()
   }
   
   private func ethereumMessage(for data: Data) -> Data {
   let prefix = "\u{19}Ethereum Signed Message:\n\(data.count)".data(using: .utf8)!
   return prefix + data
   }
   */
  
}

extension DAppWebViewController: WKUIDelegate {
  func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
    guard navigationAction.request.url != nil else {
      return nil
    }
    print("loading")
    _ = webView.load(navigationAction.request)
    print("loaded")
    return nil
  }
  
  func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
    let alert = UIAlertController(title: "", message: message, preferredStyle: .alert)
    alert.addAction(.init(title: "OK", style: .default, handler: { _ in
      completionHandler()
    }))
    present(alert, animated: true, completion: nil)
  }
  
  func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
    let alert = UIAlertController(title: "", message: message, preferredStyle: .alert)
    alert.addAction(.init(title: "OK", style: .default, handler: { _ in
      completionHandler(true)
    }))
    alert.addAction(.init(title: "Cancel", style: .cancel, handler: { _ in
      completionHandler(false)
    }))
    present(alert, animated: true, completion: nil)
  }
}


extension WKScriptMessage {
  var json: [String: Any] {
    if let string = body as? String,
       let data = string.data(using: .utf8),
       let object = try? JSONSerialization.jsonObject(with: data, options: []),
       let dict = object as? [String: Any] {
      return dict
    } else if let object = body as? [String: Any] {
      return object
    }
    return [:]
  }
}

enum DAppMethod: String, Decodable, CaseIterable {
  case signRawTransaction
  case signMessage
  case signTypedMessage
  case signPersonalMessage
  case ecRecover
  case requestAccounts
  case watchAsset
  case addEthereumChain
  case switchEthereumChain
}

extension Data {
  init?(hexString: String) {
    let len = hexString.count / 2
    var data = Data(capacity: len)
    var i = hexString.startIndex
    for _ in 0..<len {
      let j = hexString.index(i, offsetBy: 2)
      let bytes = hexString[i..<j]
      if var num = UInt8(bytes, radix: 16) {
        data.append(&num, count: 1)
      } else {
        return nil
      }
      i = j
    }
    self = data
  }
}
