import BarcodeForm from './BarcodeForm'

interface LinkProps {
  href: string
}

const Link: React.FC<LinkProps> = ({ href, children }) => (
  <a href={href} className="underline text-primary hover:no-underline whitespace-nowrap">
    {children}
  </a>
)

const SectionHeader: React.FC = ({ children }) => (
  <h3 className="text-primary font-bold text-xl pb-2">
    {children}
  </h3>
)

const Paragraph: React.FC = ({ children }) => (
  <p className="pb-4">
    {children}
  </p>
)

const App: React.FC = () => (
  <div>
    <div className="bg-primary text-white flex flex-col justify-center items-center text-center p-8">
      <img src="/logo.svg" alt="dfyb.run logo" className="w-16 md:w-24 opacity-50" />
      <h1 className="text-4xl md:text-6xl opacity-75">
        dfyb.run
      </h1>
      <p className="pt-8">
        Add your barcodes for a certain 5K and 2K run 🏃💨 to your iPhone 📱 and Apple Watch ⌚
      </p>
    </div>
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-x-24 p-8">
      <div>
        <Paragraph>
          In <Link href="https://blog.parkrun.com/uk/2021/11/22/scanning-from-mobile-devices/">November 2021</Link> parkrun HQ
          announced that virtual barcodes were now acceptable at their events, and that a physical barcode was no longer mandatory.
        </Paragraph>
        <Paragraph>
          As iPhones and Apple Watches have the <Link href="https://www.apple.com/wallet/">Apple Wallet</Link> feature that make ID passes and barcodes easily accessible,
          it seemed like a great fit!
        </Paragraph>
        <div className="flex flex-row justify-around pb-8">
          <div className="w-64 bg-light-500 p-4 rounded-lg text-center">
            <div className="bg-black p-1 rounded-lg">
              <img className="object-cover" src="/iphone-screenshot.png" alt="The pass on an iPhone" />
            </div>
            <p className="pt-4">
              On an iPhone 📱
            </p>
          </div>
          <div className="w-64 bg-light-500 p-4 rounded-lg text-center">
            <div className="bg-black p-1 rounded-lg">
              <img className="object-cover" src="/watch-screenshot.png" alt="The pass on an Apple Watch" />
            </div>
            <p className="pt-4">
              On an Apple Watch ⌚
            </p>
          </div>
        </div>
        <Paragraph>
          <SectionHeader>
            How do I use it on my iPhone?
          </SectionHeader>
          Fill out the form with your details, and click "Generate Pass" to create a QR code. Scan it with your phone,
          and add the pass to your Apple Wallet.
        </Paragraph>
        <Paragraph>
          If you're filling this out on your iPhone, you can click the "Add to Apple Wallet" button to add the pass directly.
        </Paragraph>
        <Paragraph>
          After a run, simply double-click the side button to bring up your wallet, then tap on
          the <strong>dfyb.run</strong> pass to bring up your barcode. Simply present this to the scanners at the end of the run!
        </Paragraph>
        <Paragraph>
          <SectionHeader>
            How do I use it on my Apple Watch?
          </SectionHeader>
          If you have an Apple Watch linked to your iPhone, your barcode will automatically be carried across.
        </Paragraph>
        <Paragraph>
          After a run, double-click the side button to bring up your wallet, and scroll down to your **dfyb.run** pass.
          Tap it, and it will bring up your barcode. Simply present this to the scanners at the end of the run!
        </Paragraph>
        <Paragraph>
          <SectionHeader>
            Do I still need a physical barcode?
          </SectionHeader>
          It is <strong>strongly advised</strong> that you still carry your physical barcode for its emergency contact information, or in case the
          battery on your device runs out. Adding your barcode to your Apple Wallet is designed just as a convenience!
        </Paragraph>
        <Paragraph>
          <SectionHeader>
            Who made this?
          </SectionHeader>
          This tool was made by Robert Sargant (<Link href="https://www.parkrun.org.uk/parkrunner/208864/all/">A208864</Link>) in order to scratch a personal itch.
          It's open source, and you can <Link href="https://github.com/sargant/dfyb.run">find it on Github</Link>!
        </Paragraph>
      </div>
      <div>
        <BarcodeForm />
      </div>
    </div>
  </div>
);

export default App;
