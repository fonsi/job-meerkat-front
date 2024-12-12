'use client'

import { Company } from '@/company/company'
import { placeholder } from '@/shared/image/placeholder';
import { Colors, Device } from '@/shared/styles/constants';
import Image from 'next/image';
import styled from 'styled-components';

type Props = {
    company: Company;
}

const Header = styled.div`
    display: flex;
    margin: 24px 8px;

    @media ${Device.tablet} { 
        margin: 48px 8px;
    }
`;

const CompanyName = styled.h1`
    font-size: 24px;

    @media ${Device.tablet} { 
        font-size: 48px;
    }
`;

const CompanyUrl = styled.a`
    color: ${Colors.mediumGrey};
    font-size: 16px;
`;

const CompanyInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 24px;
`;

const CompanyImage = styled.div`
    background-color: ${Colors.white};
    flex-shrink: 0;
    position: relative;
    width: 50px;

    @media ${Device.tablet} { 
        width: 100px;
    }

    img {
        object-fit: contain;
        padding: 4px;
    }
`;

export const CompanyHeader = ({ company }: Props) =>
    <Header>
        <CompanyImage>
            <Image
                alt={`${company.name} logo`}
                fill={true}
                src='https://logowik.com/content/uploads/images/bluesky-social50.logowik.com.webp'
                placeholder='blur'
                blurDataURL={placeholder}
                onError={(props) => {
                    props.currentTarget.src = placeholder;
                }}
            />
        </CompanyImage>
        <CompanyInfo>
            <CompanyName>{ company.name }</CompanyName>
            <CompanyUrl target='_blank' href={company.homePage}>{ company.homePage }</CompanyUrl>
        </CompanyInfo>
    </Header>;