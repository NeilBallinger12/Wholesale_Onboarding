import {
  SiteFooterV2,
  SiteFooterV2Main,
  SiteFooterV2ItemGroup,
  SiteFooterV2Item,
  SiteFooterV2Utility,
} from "@arc-ui/components/SiteFooterV2";

export const DashboardFooter = () => {
  return (
    <SiteFooterV2 slogan="All business. No drama.">
      <SiteFooterV2Main columns={4}>
        <SiteFooterV2ItemGroup title="Explore BT">
          <SiteFooterV2Item href="#">For the home</SiteFooterV2Item>
          <SiteFooterV2Item href="#">For Wholesale</SiteFooterV2Item>
          <SiteFooterV2Item href="#">For global businesses</SiteFooterV2Item>
          <SiteFooterV2Item href="#">BT Group</SiteFooterV2Item>
        </SiteFooterV2ItemGroup>

        <SiteFooterV2ItemGroup title="Find your business">
          <SiteFooterV2Item href="#">Small and medium business</SiteFooterV2Item>
          <SiteFooterV2Item href="#">Corporate</SiteFooterV2Item>
          <SiteFooterV2Item href="#">Public sector</SiteFooterV2Item>
        </SiteFooterV2ItemGroup>

        <SiteFooterV2ItemGroup title="Useful links">
          <SiteFooterV2Item href="#">Help and support</SiteFooterV2Item>
          <SiteFooterV2Item href="#">BT Local Business</SiteFooterV2Item>
          <SiteFooterV2Item href="#">Contact BT</SiteFooterV2Item>
          <SiteFooterV2Item href="#">Sitemap</SiteFooterV2Item>
        </SiteFooterV2ItemGroup>

        <SiteFooterV2ItemGroup title="Follow us">
          <SiteFooterV2Item href="#">BT Business Community</SiteFooterV2Item>
          <SiteFooterV2Item href="#">LinkedIn</SiteFooterV2Item>
          <SiteFooterV2Item href="#">Twitter / X</SiteFooterV2Item>
          <SiteFooterV2Item href="#">YouTube</SiteFooterV2Item>
          <SiteFooterV2Item href="#">Instagram</SiteFooterV2Item>
        </SiteFooterV2ItemGroup>
      </SiteFooterV2Main>

      <SiteFooterV2Utility copyrightYear={new Date()}>
        <SiteFooterV2Item href="#">Cookies</SiteFooterV2Item>
        <SiteFooterV2Item href="#">Terms of use</SiteFooterV2Item>
        <SiteFooterV2Item href="#">Code of practice</SiteFooterV2Item>
        <SiteFooterV2Item href="#">Privacy policy</SiteFooterV2Item>
        <SiteFooterV2Item href="#">Accessibility</SiteFooterV2Item>
      </SiteFooterV2Utility>
    </SiteFooterV2>
  );
};
