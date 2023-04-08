from application.branches.anon_branch import AnonBranch
from application.branches.auth_branch import AuthBranch
from application.branches.anon_rand_branch import AnonRandBranch
from application.branches.auth_rand_branch import AuthRandBranch


Branch = AuthBranch | AnonBranch | AnonRandBranch | AuthRandBranch