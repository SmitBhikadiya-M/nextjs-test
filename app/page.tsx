"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { CompanyProfile } from "@peddleon/ped-ux-template-library";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Template = () => {
  const searchParam = useSearchParams();
  return (
    <CompanyProfile
      templateConfig={{
        retrieveComapnyConfig: {
          api: "https://dev-service.peddle.com/buyer/odata/v2/companies?%24filter=id+eq+5230",
          mapRetrieveDataFn: (res) => {
            const data = res?.value[0] ?? {};
            return {
              id: data?.id,
              name: data?.name,
              phone: data?.phone,
              website: { value: data?.website, isRequired: false, hide: false },
              mailingAddress: {
                street: data?.mailing_address?.street,
                zipCode: data?.mailing_address?.zip_code,
                city: data?.mailing_address?.city,
                stateCode: data?.mailing_address?.state_code,
                country: data?.mailing_address?.country,
              },
              dropOffAddress: {
                street: data?.address?.street,
                zipCode: data?.address?.zip_code,
                city: data?.address?.city,
                stateCode: data?.address?.state_code,
                country: data?.address?.country,
              },
            };
          },
          fetchToken: () => searchParam.get("token") || "fetch_Token",
        },
        updateComapnyConfig: {
          api: "https://dev-service.peddle.com/buyer/odata/v1/companies/5230",
          mapUpdateDataFn: (formData) => {
            const { name, phone, website, mailingAddress, dropOffAddress } =
              formData;
            return {
              name,
              phone,
              website,
              mailing_address: mailingAddress && {
                street: mailingAddress?.street,
                zip_code: mailingAddress?.zipCode,
                city: mailingAddress?.city,
                state_code: mailingAddress?.stateCode,
              },
              address: dropOffAddress && {
                street: dropOffAddress?.street,
                zip_code: dropOffAddress?.zipCode,
                city: dropOffAddress?.city,
                state_code: dropOffAddress?.stateCode,
              },
            };
          },
          fetchToken: () => "fetch_token",
          overrideFieldErrorMessages: {
            website: {
              website_exceeds_max_length:
                "[*] Website cannot exceed the maximum length",
            },
            name: {
              invalid_name: "[*] Name is invalid",
              name_exceeds_max_length:
                "[*] Name cannot exceed the maximum length",
            },
            mailingZipcode: {
              invalid_mailing_zip_code: "[*] Mailing ZIP code is invalid",
            },
          },
        },
        zipCodeConfig: {
          api: (zipCode) =>
            `https://dev-service.peddle.com/universal/v1/zip-codes/${zipCode}`,
          mapRetrieveDataFn: (res) => ({
            zipCode: res?.zip_code,
            city: res?.cities[0],
            stateCode: res?.state.code,
          }),
          fetchToken: () => "fetch_token",
        },
        googlePlaceAPIKey: "",
        hasMailingAddressSection: true,
        hasDropoffAddressSection: true,
      }}
    />
  );
};

export default function Home() {
  return (
    <Suspense>
      <Template />
    </Suspense>
  );
}
