//
//  PopuoutModalViewController.swift
//  wallet
//
//  Created by ddigiacomo on 8/18/22.
//

import UIKit

class PopuoutModalViewController: UIViewController {
  
  lazy var infoText: String = ""
  lazy var declineText: String = ""
  lazy var approveText: String = ""
  lazy var onApprovalClosure: () -> Void = {}
  lazy var onCancelClosure: () -> Void = {}
  
  @IBAction func declineTapped(_ sender: UIButton) {
    onCancelClosure()
  }
  @IBAction func approvalTapped(_ sender: UIButton) {
    onApprovalClosure()
  }

    override func viewDidLoad() {
        super.viewDidLoad()

      self.view.backgroundColor = hexStringToUIColor(hex: "#1A1A1B")
      
              let decline = UIButton(type: .system)
              // gitHubButton.contentEdgeInsets = UIEdgeInsets(top: 12, left: 16, bottom: 12, right: 16)
              decline.addTarget(self, action: #selector(declineTapped(_:)), for: .touchUpInside)
              decline.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
              decline.clipsToBounds = true
              decline.layer.cornerRadius = 10

              decline.backgroundColor = hexStringToUIColor(hex: "#333F44")
              decline.tintColor = .white
      decline.setTitle(self.declineText, for: .normal)
      
      let approve = UIButton(type: .system)
              approve.addTarget(self, action: #selector(approvalTapped(_:)), for: .touchUpInside)
              // gitHubButton.contentEdgeInsets = UIEdgeInsets(top: 12, left: 16, bottom: 12, right: 16)
              approve.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
              approve.clipsToBounds = true

              approve.backgroundColor = hexStringToUIColor(hex: "#37AA9C")
      approve.layer.cornerRadius = 10
              approve.tintColor = .white
      approve.setTitle(self.approveText, for: .normal)
      
      let info = UILabel()
          info.font = .systemFont(ofSize: 18, weight: .light)
          info.numberOfLines = 0
          info.textAlignment = .center
      info.textColor = .white
          info.text = self.infoText



      let infoStackView = UIStackView(arrangedSubviews: [
            info,
        ])

              infoStackView.isLayoutMarginsRelativeArrangement = true
              infoStackView.layoutMargins = UIEdgeInsets(top: 6, left: 16, bottom: 32, right: 16)
              infoStackView.spacing = 16
              infoStackView.translatesAutoresizingMaskIntoConstraints = false
      let actionsStackView = UIStackView(arrangedSubviews: [
            decline, approve,
        ])

              actionsStackView.isLayoutMarginsRelativeArrangement = true
              actionsStackView.layoutMargins = UIEdgeInsets(top: 6, left: 16, bottom: 32, right: 16)
              actionsStackView.spacing = 16
              actionsStackView.translatesAutoresizingMaskIntoConstraints = false
      
              actionsStackView.alignment = .fill
              actionsStackView.distribution = .fillEqually
              actionsStackView.spacing = 8.0
      
      let rootStackView = UIStackView(arrangedSubviews: [
            infoStackView, actionsStackView,
        ])

              rootStackView.axis = .vertical
              rootStackView.isLayoutMarginsRelativeArrangement = true
              rootStackView.layoutMargins = UIEdgeInsets(top: 32, left: 16, bottom: 32, right: 16)
              rootStackView.spacing = 16
              rootStackView.translatesAutoresizingMaskIntoConstraints = false
      

              self.view.addSubview(rootStackView)

              NSLayoutConstraint.activate([

                rootStackView.topAnchor.constraint(equalTo: self.view.safeAreaLayoutGuide.topAnchor),
                rootStackView.leadingAnchor.constraint(equalTo: self.view.leadingAnchor),
                rootStackView.trailingAnchor.constraint(equalTo: self.view.trailingAnchor),
                ])
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
func hexStringToUIColor (hex:String) -> UIColor {
    var cString:String = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()

    if (cString.hasPrefix("#")) {
        cString.remove(at: cString.startIndex)
    }

    if ((cString.count) != 6) {
        return UIColor.gray
    }

    var rgbValue:UInt32 = 0
    Scanner(string: cString).scanHexInt32(&rgbValue)

    return UIColor(
        red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
        green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
        blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
        alpha: CGFloat(1.0)
    )
}
