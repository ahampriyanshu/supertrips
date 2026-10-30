export default function BrandLogo({ showMark = true }) {
  return (
    <>
      {showMark && <img className="app-brand-mark" src="/brand-mark.svg" width="54" height="54" alt="" />}
      <span className="app-brand-name">Super<em>trips</em></span>
    </>
  );
}
