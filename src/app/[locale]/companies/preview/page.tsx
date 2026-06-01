import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function PreviewRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect(`/${resolvedParams.locale}/login`);
  }

  const company = await prisma.company.findFirst({
    where: {
      user: {
        email: session.user.email
      }
    }
  });

  if (company && company.slug) {
    redirect(`/${resolvedParams.locale}/${company.slug}`);
  } else {
    redirect(`/${resolvedParams.locale}/dashboard`);
  }
}
