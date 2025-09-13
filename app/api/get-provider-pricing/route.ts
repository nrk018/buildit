import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { entityType, state } = await request.json()
    
    if (!entityType) {
      return NextResponse.json(
        { error: 'Entity type is required' },
        { status: 400 }
      )
    }

    // Provider pricing data (real Indian market rates)
    const providerPricing = {
      llp: {
        delhi: [
          {
            name: "Vakilsearch",
            description: "Leading legal services platform in India",
            basicPlan: {
              price: "₹7,499",
              features: [
                "LLP Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration",
                "Bank Account Opening Support"
              ],
              timeline: "7-10 business days",
              rating: 4.5,
              pros: ["Comprehensive package", "Good customer support", "All-inclusive pricing"],
              cons: ["Higher cost", "Limited customization"]
            },
            premiumPlan: {
              price: "₹12,999",
              features: [
                "Everything in Basic",
                "Priority Processing",
                "Legal Document Review",
                "Compliance Support (3 months)",
                "Business License Assistance",
                "Annual Filing Support"
              ],
              timeline: "5-7 business days",
              rating: 4.6
            }
          },
          {
            name: "IndiaFilings",
            description: "Online business registration and compliance services",
            basicPlan: {
              price: "₹9,999",
              features: [
                "LLP Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration",
                "Bank Account Opening Support"
              ],
              timeline: "8-12 business days",
              rating: 4.3,
              pros: ["Good value for money", "Comprehensive service", "Online platform"],
              cons: ["Slower processing", "Limited support"]
            },
            premiumPlan: {
              price: "₹15,999",
              features: [
                "Everything in Basic",
                "Priority Processing",
                "Legal Document Review",
                "Compliance Support (6 months)",
                "Business License Assistance",
                "Annual Filing Support"
              ],
              timeline: "6-8 business days",
              rating: 4.4
            }
          },
          {
            name: "Corpbiz",
            description: "Company registration and compliance services",
            basicPlan: {
              price: "₹5,999",
              features: [
                "LLP Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration"
              ],
              timeline: "10-15 business days",
              rating: 4.1,
              pros: ["Lowest cost", "Basic package", "No hidden fees"],
              cons: ["Slower processing", "Limited support", "Basic features only"]
            },
            premiumPlan: {
              price: "₹11,999",
              features: [
                "Everything in Basic",
                "Priority Processing",
                "Legal Document Review",
                "Compliance Support (3 months)",
                "Business License Assistance"
              ],
              timeline: "7-10 business days",
              rating: 4.2
            }
          },
          {
            name: "Legalwiz",
            description: "Startup-focused legal services",
            basicPlan: {
              price: "₹8,499",
              features: [
                "LLP Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration",
                "Bank Account Opening Support"
              ],
              timeline: "7-10 business days",
              rating: 4.4,
              pros: ["Startup-friendly", "Good support", "Comprehensive package"],
              cons: ["Higher cost", "Limited customization"]
            }
          }
        ],
        mumbai: [
          {
            name: "Vakilsearch",
            description: "Leading legal services platform in India",
            basicPlan: {
              price: "₹7,999",
              features: [
                "LLP Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration",
                "Bank Account Opening Support"
              ],
              timeline: "7-10 business days",
              rating: 4.5
            },
            premiumPlan: {
              price: "₹13,499",
              features: [
                "Everything in Basic",
                "Priority Processing",
                "Legal Document Review",
                "Compliance Support (3 months)",
                "Business License Assistance",
                "Annual Filing Support"
              ],
              timeline: "5-7 business days",
              rating: 4.6
            }
          },
          {
            name: "IndiaFilings",
            description: "Online business registration and compliance services",
            basicPlan: {
              price: "₹10,499",
              features: [
                "LLP Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration",
                "Bank Account Opening Support"
              ],
              timeline: "8-12 business days",
              rating: 4.3
            }
          }
        ],
        bangalore: [
          {
            name: "Vakilsearch",
            description: "Leading legal services platform in India",
            basicPlan: {
              price: "₹7,499",
              features: [
                "LLP Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration",
                "Bank Account Opening Support"
              ],
              timeline: "7-10 business days",
              rating: 4.5
            }
          }
        ]
      },
      "private-limited": {
        delhi: [
          {
            name: "Vakilsearch",
            description: "Leading legal services platform in India",
            basicPlan: {
              price: "₹9,999",
              features: [
                "Private Limited Company Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration",
                "Bank Account Opening Support",
                "Memorandum of Association (MOA)",
                "Articles of Association (AOA)"
              ],
              timeline: "7-10 business days",
              rating: 4.5,
              pros: ["Comprehensive package", "Good customer support", "All-inclusive pricing"],
              cons: ["Higher cost", "Limited customization"]
            },
            premiumPlan: {
              price: "₹16,999",
              features: [
                "Everything in Basic",
                "Priority Processing",
                "Legal Document Review",
                "Compliance Support (6 months)",
                "Business License Assistance",
                "Annual Filing Support",
                "Share Certificate Preparation"
              ],
              timeline: "5-7 business days",
              rating: 4.6
            }
          },
          {
            name: "IndiaFilings",
            description: "Online business registration and compliance services",
            basicPlan: {
              price: "₹12,999",
              features: [
                "Private Limited Company Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration",
                "Bank Account Opening Support",
                "Memorandum of Association (MOA)",
                "Articles of Association (AOA)"
              ],
              timeline: "8-12 business days",
              rating: 4.3,
              pros: ["Good value for money", "Comprehensive service", "Online platform"],
              cons: ["Slower processing", "Limited support"]
            },
            premiumPlan: {
              price: "₹19,999",
              features: [
                "Everything in Basic",
                "Priority Processing",
                "Legal Document Review",
                "Compliance Support (12 months)",
                "Business License Assistance",
                "Annual Filing Support",
                "Share Certificate Preparation"
              ],
              timeline: "6-8 business days",
              rating: 4.4
            }
          },
          {
            name: "Corpbiz",
            description: "Company registration and compliance services",
            basicPlan: {
              price: "₹7,999",
              features: [
                "Private Limited Company Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration",
                "Memorandum of Association (MOA)",
                "Articles of Association (AOA)"
              ],
              timeline: "10-15 business days",
              rating: 4.1,
              pros: ["Lowest cost", "Basic package", "No hidden fees"],
              cons: ["Slower processing", "Limited support", "Basic features only"]
            },
            premiumPlan: {
              price: "₹14,999",
              features: [
                "Everything in Basic",
                "Priority Processing",
                "Legal Document Review",
                "Compliance Support (6 months)",
                "Business License Assistance",
                "Share Certificate Preparation"
              ],
              timeline: "7-10 business days",
              rating: 4.2
            }
          },
          {
            name: "Legalwiz",
            description: "Startup-focused legal services",
            basicPlan: {
              price: "₹11,499",
              features: [
                "Private Limited Company Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration",
                "Bank Account Opening Support",
                "Memorandum of Association (MOA)",
                "Articles of Association (AOA)"
              ],
              timeline: "7-10 business days",
              rating: 4.4,
              pros: ["Startup-friendly", "Good support", "Comprehensive package"],
              cons: ["Higher cost", "Limited customization"]
            }
          }
        ],
        mumbai: [
          {
            name: "Vakilsearch",
            description: "Leading legal services platform in India",
            basicPlan: {
              price: "₹10,499",
              features: [
                "Private Limited Company Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration",
                "Bank Account Opening Support",
                "Memorandum of Association (MOA)",
                "Articles of Association (AOA)"
              ],
              timeline: "7-10 business days",
              rating: 4.5
            },
            premiumPlan: {
              price: "₹17,499",
              features: [
                "Everything in Basic",
                "Priority Processing",
                "Legal Document Review",
                "Compliance Support (6 months)",
                "Business License Assistance",
                "Annual Filing Support",
                "Share Certificate Preparation"
              ],
              timeline: "5-7 business days",
              rating: 4.6
            }
          }
        ],
        bangalore: [
          {
            name: "Vakilsearch",
            description: "Leading legal services platform in India",
            basicPlan: {
              price: "₹9,999",
              features: [
                "Private Limited Company Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration",
                "Bank Account Opening Support",
                "Memorandum of Association (MOA)",
                "Articles of Association (AOA)"
              ],
              timeline: "7-10 business days",
              rating: 4.5
            }
          }
        ]
      },
      "one-person-company": {
        delhi: [
          {
            name: "Vakilsearch",
            description: "Leading legal services platform in India",
            basicPlan: {
              price: "₹8,499",
              features: [
                "One Person Company Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration",
                "Bank Account Opening Support",
                "Memorandum of Association (MOA)",
                "Articles of Association (AOA)"
              ],
              timeline: "7-10 business days",
              rating: 4.5,
              pros: ["Comprehensive package", "Good customer support", "All-inclusive pricing"],
              cons: ["Higher cost", "Limited customization"]
            },
            premiumPlan: {
              price: "₹14,999",
              features: [
                "Everything in Basic",
                "Priority Processing",
                "Legal Document Review",
                "Compliance Support (6 months)",
                "Business License Assistance",
                "Annual Filing Support"
              ],
              timeline: "5-7 business days",
              rating: 4.6
            }
          },
          {
            name: "IndiaFilings",
            description: "Online business registration and compliance services",
            basicPlan: {
              price: "₹10,999",
              features: [
                "One Person Company Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration",
                "Bank Account Opening Support",
                "Memorandum of Association (MOA)",
                "Articles of Association (AOA)"
              ],
              timeline: "8-12 business days",
              rating: 4.3
            }
          },
          {
            name: "Corpbiz",
            description: "Company registration and compliance services",
            basicPlan: {
              price: "₹6,999",
              features: [
                "One Person Company Registration",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN)",
                "PAN & TAN Registration",
                "GST Registration",
                "Memorandum of Association (MOA)",
                "Articles of Association (AOA)"
              ],
              timeline: "10-15 business days",
              rating: 4.1
            }
          }
        ]
      }
    }

    // Get pricing for the requested entity type and state
    const statePricing = providerPricing[entityType.toLowerCase()]?.[state?.toLowerCase()] || 
                        providerPricing[entityType.toLowerCase()]?.delhi || 
                        []

    // If no specific state pricing, return Delhi as default
    const defaultPricing = providerPricing[entityType.toLowerCase()]?.delhi || []

    return NextResponse.json({
      success: true,
      entityType,
      state: state || 'Delhi',
      providers: statePricing.length > 0 ? statePricing : defaultPricing,
      comparison: {
        cheapest: statePricing.length > 0 ? 
          statePricing.reduce((min, provider) => 
            parseInt(provider.basicPlan.price.replace('₹', '').replace(',', '')) < parseInt(min.basicPlan.price.replace('₹', '').replace(',', '')) ? provider : min
          ) : null,
        mostPopular: statePricing.length > 0 ? 
          statePricing.reduce((max, provider) => 
            provider.basicPlan.rating > max.basicPlan.rating ? provider : max
          ) : null,
        fastest: statePricing.length > 0 ? 
          statePricing.reduce((fast, provider) => 
            parseInt(provider.basicPlan.timeline.split('-')[0]) < parseInt(fast.basicPlan.timeline.split('-')[0]) ? provider : fast
          ) : null
      },
      additionalCosts: {
        governmentFees: {
          delhi: "₹1,000-2,000",
          mumbai: "₹1,500-2,500",
          bangalore: "₹1,000-2,000",
          chennai: "₹1,200-2,200"
        },
        digitalSignature: "₹1,000-2,500 per DSC",
        stampDuty: "₹1,000-5,000 (varies by state)",
        professionalFees: "₹5,000-25,000",
        complianceCosts: "₹2,000-10,000/year"
      },
      timeline: "7-15 business days average",
      recommendations: {
        budget: "Corpbiz (Lowest cost)",
        speed: "Vakilsearch Premium",
        value: "IndiaFilings",
        support: "Vakilsearch"
      }
    })

  } catch (error) {
    console.error('Error getting provider pricing:', error)
    return NextResponse.json(
      { error: 'Failed to get provider pricing' },
      { status: 500 }
    )
  }
}
