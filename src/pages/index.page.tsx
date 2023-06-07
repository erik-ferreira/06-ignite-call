import { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { buildNextAuthOptions } from "./api/auth/[...nextauth].api"

export { default } from "./home"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  )

  const userIsSigned = !!session

  if (userIsSigned) {
    return {
      props: {},
      redirect: {
        destination: `/schedule/${session.user.username}`,
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
